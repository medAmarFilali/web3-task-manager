const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Manager", function () {
  let Manager, manager;

  before(async function () {
    Manager = await ethers.getContractFactory("Manager");
    manager = await Manager.deploy();
    await manager.deployed();
  });

  it("Should create a new ticket", async function () {
    await manager.createTicket("Midou");
    let tickets = await manager.getTickets();

    expect(tickets[0].name).to.equal("Midou");
  });

  it("Should update the ticket name", async function () {
    await manager.updateTicketName(0, "Midou");
    let tickets = await manager.getTickets();

    expect(tickets[0].name).to.equal("Midou");
  });

  it("Should update the ticket status", async function () {
    await manager.updateTicketStatus(0, 3);
    let tickets = await manager.getTickets();

    expect(tickets[0].status).to.equal(3);
  });

  it("Should return a list of tickets", async function () {
    await manager.createTicket("Midou");
    await manager.createTicket("Lina");
    await manager.createTicket("Lulu");
    let tickets = await manager.getTickets();

    expect(tickets.length).to.equal(4);
  });
});
