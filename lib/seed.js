const { PrismaClient, Availability } = require("../lib/generated/prisma/client");
const { faker } = require("@faker-js/faker");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database with faker data...");

  // ---------- Skills ----------
  const skillNames = [
    "React",
    "Node.js",
    "Next.js",
    "Prisma",
    "TypeScript",
    "Python",
    "Docker",
    "PostgreSQL",
    "MongoDB",
    "Kubernetes",
    "Video Editing",
    "Painting",
    "UI/UX Design",
    "Photography",
    "Graphic Design",
    "Public Speaking",
    "Writing",
    "Data Analysis",
    "Machine Learning",
    "Blockchain Development",
    "Cybersecurity",
    "DevOps",
    "Testing",
    "Game Development",
    "Content Creation",
  ];
const skills = await Promise.all(
  skillNames.map((name) =>
    prisma.skills.upsert({
      where: { name },
      update: {},
      create: { name },
    })
  )
);


  // ---------- Users ----------
  const users = await Promise.all(
    Array.from({ length: 10 }).map(() =>
      prisma.user.create({
        data: {
          email: faker.internet.email(),
          name: faker.person.fullName(),
          password: faker.internet.password(),
          designation: faker.person.jobTitle(),
          stars: faker.number.int({ min: 1, max: 5 }),
          profileImage: faker.image.avatarGitHub(),
          experience: faker.number.int({ min: 0, max: 10 }),
          bio: faker.person.bio(),
          points: faker.number.int({ min: 0, max: 1000 }),
          Availability: faker.helpers.arrayElement([
            Availability.AVAILABLE,
            Availability.BUSY,
            Availability.OFFLINE,
          ]),
        },
      })
    )
  );

  // ---------- SkillsOnUsers ----------
  for (const user of users) {
    const randomSkills = faker.helpers.arrayElements(skills, { min: 3, max: 7 });
    for (const skill of randomSkills) {
      await prisma.skillsOnUsers.create({
        data: {
          userId: user.id,
          skillId: skill.id,
        },
      });
    }
  }

  // ---------- Friendships ----------
  const friendships = [];
  for (const user of users) {
    const friend = faker.helpers.arrayElement(users.filter((u) => u.id !== user.id));
    friendships.push(
      prisma.friendship.create({
        data: {
          userId: user.id,
          friendId: friend.id,
        },
      })
    );
  }
  await Promise.all(friendships);

  // ---------- Certificates ----------
  for (const user of users) {
    const count = faker.number.int({ min: 1, max: 3 });
    for (let j = 0; j < count; j++) {
      await prisma.certificate.create({
        data: {
          userId: user.id,
          title: faker.person.jobArea() + " Certification",
          institution: faker.company.name(),
          issueDate: faker.date.past({ years: 2 }),
        },
      });
    }
  }

  // ---------- Messages ----------
  for (let i = 0; i < 20; i++) {
    const sender = faker.helpers.arrayElement(users);
    let receiver = faker.helpers.arrayElement(users);
    while (receiver.id === sender.id) {
      receiver = faker.helpers.arrayElement(users);
    }
    await prisma.message.create({
      data: {
        senderId: sender.id,
        receiverId: receiver.id,
        content: faker.lorem.sentence(),
      },
    });
  }

  // ---------- OTPs ----------
  for (let i = 0; i < 5; i++) {
    await prisma.oTP.create({
      data: {
        email: faker.internet.email(),
        password: faker.internet.password(),
        code: faker.string.numeric(6),
        expiresAt: faker.date.soon({ days: 1 }),
      },
    });
  }

  console.log("✅ Database seeded successfully with faker data!");
}

main()
  .catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
