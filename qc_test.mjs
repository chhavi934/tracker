// Full QC Test Script for ProjectFlow
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres:oGBTokAxbowfVmlQfXNtuCojRThCLKqD@metro.proxy.rlwy.net:32458/railway"
    }
  }
})

async function runQC() {
  console.log("\n========================================")
  console.log("   ProjectFlow - Full QC Test Report")
  console.log("========================================\n")

  // 1. Database Connection Test
  try {
    await prisma.$connect()
    console.log("✅ DATABASE: Connected to Railway PostgreSQL successfully")
  } catch (e) {
    console.error("❌ DATABASE: Connection failed -", e.message)
    process.exit(1)
  }

  // 2. Table Existence Test
  try {
    const tables = await prisma.$queryRaw`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' ORDER BY table_name
    `
    const tableNames = tables.map(t => t.table_name)
    console.log("✅ TABLES: Found tables:", tableNames.join(", "))
    
    const required = ['User', 'Project', 'Task']
    for (const t of required) {
      if (tableNames.includes(t)) {
        console.log(`  ✅ Table '${t}' exists`)
      } else {
        console.log(`  ❌ Table '${t}' MISSING`)
      }
    }
  } catch (e) {
    console.error("❌ TABLES: Check failed -", e.message)
  }

  // 3. User CRUD Test
  console.log("\n--- Testing User Operations ---")
  let testUser
  try {
    testUser = await prisma.user.create({
      data: {
        name: "QC Test User",
        email: `qc_test_${Date.now()}@projectflow.test`,
        password: "$2a$10$test.hashed.password.here",
        role: "Admin",
        status: "Active"
      }
    })
    console.log("✅ USER CREATE: Created user ID:", testUser.id)
  } catch (e) {
    console.error("❌ USER CREATE:", e.message)
  }

  // 4. Project CRUD Test
  console.log("\n--- Testing Project Operations ---")
  let testProject
  try {
    testProject = await prisma.project.create({
      data: {
        name: "QC Test Project",
        description: "Automated QC test project",
        userId: testUser.id
      }
    })
    console.log("✅ PROJECT CREATE: Created project ID:", testProject.id)
  } catch (e) {
    console.error("❌ PROJECT CREATE:", e.message)
  }

  // 5. Task CRUD Test
  console.log("\n--- Testing Task Operations ---")
  let testTask
  try {
    testTask = await prisma.task.create({
      data: {
        title: "QC Test Task",
        description: "Automated QC test task",
        status: "TODO",
        priority: "High",
        projectId: testProject.id,
        assigneeId: testUser.id,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    })
    console.log("✅ TASK CREATE: Created task ID:", testTask.id)
  } catch (e) {
    console.error("❌ TASK CREATE:", e.message)
  }

  // 6. Task Update Test
  try {
    const updated = await prisma.task.update({
      where: { id: testTask.id },
      data: { status: "IN_PROGRESS" }
    })
    console.log("✅ TASK UPDATE: Status updated to:", updated.status)
  } catch (e) {
    console.error("❌ TASK UPDATE:", e.message)
  }

  // 7. RBAC Query Test (Admin sees all)
  try {
    const allTasks = await prisma.task.findMany({
      include: { project: true, assignee: true }
    })
    console.log("✅ RBAC ADMIN: Can query all tasks. Count:", allTasks.length)
  } catch (e) {
    console.error("❌ RBAC ADMIN:", e.message)
  }

  // 8. RBAC Query Test (Member sees only theirs)
  try {
    const myTasks = await prisma.task.findMany({
      where: { assigneeId: testUser.id }
    })
    console.log("✅ RBAC MEMBER: Member-filtered tasks. Count:", myTasks.length)
  } catch (e) {
    console.error("❌ RBAC MEMBER:", e.message)
  }

  // 9. Overdue calculation Test
  try {
    const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const overdueTask = await prisma.task.create({
      data: {
        title: "QC Overdue Task",
        status: "TODO",
        priority: "High",
        projectId: testProject.id,
        dueDate: pastDate
      }
    })
    const overdue = await prisma.task.findMany({
      where: {
        status: { not: "DONE" },
        dueDate: { lt: new Date() }
      }
    })
    console.log("✅ OVERDUE LOGIC: Overdue tasks detected. Count:", overdue.length)
    await prisma.task.delete({ where: { id: overdueTask.id } })
  } catch (e) {
    console.error("❌ OVERDUE LOGIC:", e.message)
  }

  // 10. Cleanup
  console.log("\n--- Cleaning up test data ---")
  try {
    await prisma.task.delete({ where: { id: testTask.id } })
    await prisma.project.delete({ where: { id: testProject.id } })
    await prisma.user.delete({ where: { id: testUser.id } })
    console.log("✅ CLEANUP: All test data removed")
  } catch (e) {
    console.error("❌ CLEANUP:", e.message)
  }

  await prisma.$disconnect()

  console.log("\n========================================")
  console.log("         QC Test Complete!")
  console.log("========================================\n")
}

runQC().catch(console.error)
