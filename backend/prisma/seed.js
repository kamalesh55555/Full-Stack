const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting the seeding process...');

  const filePath = path.join(__dirname, 'data.csv');
  
  if (!fs.existsSync(filePath)) {
    console.error('data.csv not found in the prisma directory!');
    return;
  }

  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let isFirstLine = true;

  for await (const line of rl) {
    // Skip the header row
    if (isFirstLine) {
      isFirstLine = false;
      continue;
    }

    // Split CSV by commas
    const [universityName, programme, branch, semesterStr, subjectCode, subjectName] = line.split(',');

    if (!universityName || !subjectCode) continue;

    const courseName = `${programme} ${branch}`.trim();
    const semester = `Semester ${semesterStr.trim()}`; // e.g., "Semester 1"

    // 1. Upsert University
    let university = await prisma.university.findUnique({
      where: { name: universityName.trim() }
    });
    
    if (!university) {
      university = await prisma.university.create({
        data: { name: universityName.trim() }
      });
      console.log(`Created University: ${university.name}`);
    }

    // 2. Upsert Course (linked to University)
    let course = await prisma.course.findUnique({
      where: {
        name_universityId: {
          name: courseName,
          universityId: university.id
        }
      }
    });
    
    if (!course) {
      course = await prisma.course.create({
        data: {
          name: courseName,
          universityId: university.id
        }
      });
      console.log(`Created Course: ${course.name} under ${university.name}`);
    }

    // 3. Upsert Subject (linked to Course)
    const existingSubject = await prisma.subject.findFirst({
      where: {
        code: subjectCode.trim(),
        courseId: course.id
      }
    });
    
    if (!existingSubject) {
      await prisma.subject.create({
        data: {
          name: subjectName.trim(),
          code: subjectCode.trim(),
          semester: semester,
          courseId: course.id
        }
      });
      console.log(`Added Subject: ${subjectCode.trim()} - ${subjectName.trim()}`);
    }
  }

  console.log('\n✅ Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
