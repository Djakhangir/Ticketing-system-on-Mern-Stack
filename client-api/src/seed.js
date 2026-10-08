// Demo seed: fills an empty database with one building, the four roles,
// and some lifelike tickets / packages / notifications so the app looks
// alive on first open. Idempotent — it wipes and re-creates the demo data.
//
//   npm run seed           (locally, with MONGO_URL set)
//   docker compose exec api npm run seed
//
// Demo logins (password for all): Passw0rd!
//   tenant@demo.com · super@demo.com · office@demo.com · owner@demo.com

require("dotenv").config();
const mongoose = require("mongoose");
const { UserSchema } = require("./model/user/User.schema");
const { TicketSchema } = require("./model/ticket/Ticket.schema");
const { PackageSchema } = require("./model/package/Package.schema");
const { NotificationSchema } = require("./model/notification/Notification.schema");
const { hashPassword } = require("./helpers/bycript.helper");

const BUILDING = "Maple Court Residences";
const PASSWORD = "Passw0rd!";

const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

const run = async () => {
  const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost/TicketingSystemAJ";
  await mongoose.connect(MONGO_URL);
  console.log("Connected:", MONGO_URL);

  // Fresh demo slate.
  await Promise.all([
    UserSchema.deleteMany({ email: /@demo\.com$/ }),
    TicketSchema.deleteMany({ building: BUILDING }),
    PackageSchema.deleteMany({ building: BUILDING }),
  ]);

  const hash = await hashPassword(PASSWORD);

  const [tenant, superintendent, office, owner] = await UserSchema.create([
    {
      name: "Taylor Reed",
      role: "tenant",
      building: BUILDING,
      apartment: "12B",
      phone: "+1 (555) 010-1212",
      email: "tenant@demo.com",
      password: hash,
      isVerified: true,
    },
    {
      name: "Sam Ortiz",
      role: "superintendent",
      building: BUILDING,
      phone: "+1 (555) 010-3434",
      email: "super@demo.com",
      password: hash,
      isVerified: true,
    },
    {
      name: "Morgan Lee",
      role: "management",
      building: BUILDING,
      phone: "+1 (555) 010-5656",
      email: "office@demo.com",
      password: hash,
      isVerified: true,
    },
    {
      name: "Jordan Vance",
      role: "landlord",
      building: BUILDING,
      phone: "+1 (555) 010-7878",
      email: "owner@demo.com",
      password: hash,
      isVerified: true,
    },
  ]);

  // Clear demo notifications for these users.
  await NotificationSchema.deleteMany({
    userId: { $in: [tenant._id, superintendent._id, office._id, owner._id] },
  });

  const tickets = await TicketSchema.create([
    {
      clientId: tenant._id,
      building: BUILDING,
      apartment: "12B",
      contactPhone: tenant.phone,
      subject: "Leaking kitchen faucet",
      category: "Plumbing",
      priority: "High",
      openAt: daysAgo(4),
      status: "Awaiting parts",
      assignedTo: superintendent._id,
      assignedName: superintendent.name,
      conversations: [
        {
          senderId: tenant._id,
          sender: tenant.name,
          senderRole: "tenant",
          message:
            "The kitchen faucet has been dripping for two days and it's getting worse. There's water pooling under the sink.",
          msgAt: daysAgo(4),
        },
        {
          senderId: superintendent._id,
          sender: superintendent.name,
          senderRole: "superintendent",
          message:
            "Thanks Taylor — I took a look, the cartridge is worn. I've ordered a replacement. Will schedule a visit once it arrives.",
          msgAt: daysAgo(3),
        },
      ],
      parts: [
        {
          name: "Moen 1225 faucet cartridge",
          quantity: 1,
          supplier: "City Plumbing Supply",
          status: "Pending arrival",
          orderedAt: daysAgo(3),
        },
      ],
    },
    {
      clientId: tenant._id,
      building: BUILDING,
      apartment: "12B",
      contactPhone: tenant.phone,
      subject: "Bedroom heater not turning on",
      category: "Heating/Cooling",
      priority: "Emergency",
      openAt: daysAgo(1),
      status: "Appointment scheduled",
      assignedTo: superintendent._id,
      assignedName: superintendent.name,
      conversations: [
        {
          senderId: tenant._id,
          sender: tenant.name,
          senderRole: "tenant",
          message: "The bedroom heater is completely dead and it's freezing tonight.",
          msgAt: daysAgo(1),
        },
        {
          senderId: office._id,
          sender: office.name,
          senderRole: "management",
          message:
            "We're treating this as urgent. A licensed HVAC tech is booked for tomorrow morning.",
          msgAt: daysAgo(1),
        },
      ],
      appointment: {
        scheduledFor: daysAgo(-1),
        professional: "Nexus HVAC Services",
        note: "Bring replacement thermostat and igniter.",
        status: "Scheduled",
      },
    },
    {
      clientId: tenant._id,
      building: BUILDING,
      apartment: "12B",
      contactPhone: tenant.phone,
      subject: "Front door buzzer intermittent",
      category: "Electrical",
      priority: "Low",
      openAt: daysAgo(10),
      status: "Closed",
      assignedTo: superintendent._id,
      assignedName: superintendent.name,
      conversations: [
        {
          senderId: tenant._id,
          sender: tenant.name,
          senderRole: "tenant",
          message: "The door buzzer only works sometimes.",
          msgAt: daysAgo(10),
        },
        {
          senderId: superintendent._id,
          sender: superintendent.name,
          senderRole: "superintendent",
          message: "Replaced the buzzer relay. All set — closing this out.",
          msgAt: daysAgo(8),
        },
      ],
    },
  ]);

  await PackageSchema.create([
    {
      building: BUILDING,
      apartment: "12B",
      recipientId: tenant._id,
      courier: "Amazon",
      note: "Medium box, left at concierge desk.",
      status: "Awaiting pickup",
      loggedBy: superintendent._id,
      loggedByName: superintendent.name,
      createdAt: daysAgo(0),
    },
    {
      building: BUILDING,
      apartment: "12B",
      recipientId: tenant._id,
      courier: "FedEx",
      status: "Picked up",
      loggedBy: superintendent._id,
      loggedByName: superintendent.name,
      createdAt: daysAgo(6),
      pickedUpAt: daysAgo(5),
    },
  ]);

  const emergency = tickets[1];
  await NotificationSchema.create([
    {
      userId: tenant._id,
      type: "appointment",
      title: "Repair appointment scheduled",
      body: "Nexus HVAC Services will visit tomorrow morning.",
      link: `/ticket/${emergency._id}`,
      createdAt: daysAgo(1),
    },
    {
      userId: tenant._id,
      type: "package",
      title: "A package is waiting in the lobby",
      body: "Amazon · Please collect it at your convenience.",
      link: "/packages",
      read: false,
      createdAt: daysAgo(0),
    },
    {
      userId: superintendent._id,
      type: "ticket",
      title: "New Emergency ticket · Apt 12B",
      body: "Bedroom heater not turning on",
      link: `/ticket/${emergency._id}`,
      createdAt: daysAgo(1),
    },
  ]);

  console.log("\nSeed complete. Demo logins (password: %s):", PASSWORD);
  console.log("  tenant@demo.com   (tenant)");
  console.log("  super@demo.com    (superintendent)");
  console.log("  office@demo.com   (management)");
  console.log("  owner@demo.com    (landlord)");

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
