import {
  MockCustomer,
  MockUnit,
  MockProject,
  MockBlock,
  MockBank,
  MockRatePreset,
  SEED_USERS,
  SEED_PROJECTS,
  SEED_BLOCKS,
  SEED_UNITS,
  SEED_BANKS,
  SEED_PRESETS,
  SEED_CUSTOMERS,
  SEED_AUDIT_LOGS,
} from "./mock-data";
import { UserRole, SessionUser } from "./auth/rbac";
import { AuditLogEntry, createAuditLog } from "./security/uu-pdp";

class KavlingStore {
  private users: SessionUser[] = [...SEED_USERS];
  private currentUser: SessionUser = SEED_USERS[0]; // Default: Marketing
  private projects: MockProject[] = [...SEED_PROJECTS];
  private blocks: MockBlock[] = [...SEED_BLOCKS];
  private units: MockUnit[] = [...SEED_UNITS];
  private banks: MockBank[] = [...SEED_BANKS];
  private presets: MockRatePreset[] = [...SEED_PRESETS];
  private customers: MockCustomer[] = [...SEED_CUSTOMERS];
  private auditLogs: AuditLogEntry[] = [...SEED_AUDIT_LOGS];

  getCurrentUser(): SessionUser {
    return this.currentUser;
  }

  setCurrentRole(role: UserRole) {
    const user = this.users.find((u) => u.role === role);
    if (user) {
      this.currentUser = user;
    }
  }

  getProjects(): MockProject[] {
    return this.projects;
  }

  getBlocks(projectId?: string): MockBlock[] {
    return projectId
      ? this.blocks.filter((b) => b.projectId === projectId)
      : this.blocks;
  }

  getUnits(projectId?: string, blockId?: string): MockUnit[] {
    return this.units.filter((u) => {
      if (projectId && u.projectId !== projectId) return false;
      if (blockId && u.blockId !== blockId) return false;
      return true;
    });
  }

  getBanks(): MockBank[] {
    return this.banks;
  }

  getRatePresets(): MockRatePreset[] {
    return this.presets;
  }

  getCustomers(role?: UserRole): MockCustomer[] {
    // If Marketing, only show own leads
    if (role === "MARKETING" && this.currentUser.role === "MARKETING") {
      return this.customers.filter((c) => c.marketingId === this.currentUser.id);
    }
    // SPV, Developer, Admin see all leads for their projects
    return this.customers;
  }

  getCustomerById(id: string): MockCustomer | undefined {
    return this.customers.find((c) => c.id === id);
  }

  getAuditLogs(): AuditLogEntry[] {
    return this.auditLogs.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  // --- MUTATIONS ---

  createLead(data: {
    fullName: string;
    phoneNumber: string;
    email: string;
    nik?: string;
    npwp?: string;
    address?: string;
    occupation?: string;
    monthlyIncome: number;
    existingObligations?: number;
    leadSource: MockCustomer["leadSource"];
    projectId: string;
    notes?: string;
    nextFollowUpDate?: string;
  }): MockCustomer {
    const project = this.projects.find((p) => p.id === data.projectId);
    const newCustomer: MockCustomer = {
      id: `cust-${Date.now()}`,
      marketingId: this.currentUser.id,
      marketingName: this.currentUser.fullName,
      projectId: data.projectId,
      projectName: project ? project.name : "Perumahan",
      pipelineStatus: "NEW_LEAD",
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      email: data.email,
      nik: data.nik || "",
      npwp: data.npwp || "",
      address: data.address || "",
      occupation: data.occupation || "",
      monthlyIncome: data.monthlyIncome,
      existingObligations: data.existingObligations || 0,
      leadSource: data.leadSource,
      notes: data.notes || "",
      nextFollowUpDate: data.nextFollowUpDate || new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      activities: [],
      simulations: [],
    };

    this.customers.unshift(newCustomer);

    this.auditLogs.unshift(
      createAuditLog(
        "LEAD_CREATED",
        "Customer",
        newCustomer.id,
        { fullName: newCustomer.fullName, phone: newCustomer.phoneNumber },
        this.currentUser.id,
        this.currentUser.fullName,
        this.currentUser.role
      )
    );

    return newCustomer;
  }

  logFollowUp(
    customerId: string,
    activityType: "CALL" | "WHATSAPP" | "SITE_VISIT" | "MEETING",
    outcomeNotes: string,
    nextFollowUpDate: string
  ) {
    const cust = this.customers.find((c) => c.id === customerId);
    if (!cust) return;

    cust.activities.unshift({
      id: `act-${Date.now()}`,
      customerId,
      userId: this.currentUser.id,
      userName: this.currentUser.fullName,
      activityType,
      outcomeNotes,
      followUpDate: new Date().toISOString(),
      nextFollowUpDate,
    });

    cust.nextFollowUpDate = nextFollowUpDate;
    if (cust.pipelineStatus === "NEW_LEAD") {
      cust.pipelineStatus = "FOLLOW_UP";
    }

    this.auditLogs.unshift(
      createAuditLog(
        "FOLLOW_UP_LOGGED",
        "Customer",
        customerId,
        { activityType, nextFollowUpDate },
        this.currentUser.id,
        this.currentUser.fullName,
        this.currentUser.role
      )
    );
  }

  selectUnitForCustomer(customerId: string, unitId: string) {
    const cust = this.customers.find((c) => c.id === customerId);
    const unit = this.units.find((u) => u.id === unitId);
    if (!cust || !unit) return;

    cust.interestedUnitId = unit.id;
    cust.unitNumber = unit.unitNumber;

    this.auditLogs.unshift(
      createAuditLog(
        "UNIT_SELECTED",
        "Customer",
        customerId,
        { unitNumber: unit.unitNumber, basePrice: unit.basePrice },
        this.currentUser.id,
        this.currentUser.fullName,
        this.currentUser.role
      )
    );
  }

  saveSimulation(customerId: string, simData: any) {
    const cust = this.customers.find((c) => c.id === customerId);
    if (!cust) return;

    // Reset previous primary
    cust.simulations.forEach((s) => (s.isPrimary = false));

    cust.simulations.unshift({
      id: `sim-${Date.now()}`,
      customerId,
      ratePresetId: simData.presetId || "preset-custom",
      presetName: simData.presetName || "Simulasi KPR",
      unitPrice: simData.propertyPrice,
      dpAmount: simData.downPaymentAmount,
      dpPercentage: simData.downPaymentPercent,
      loanAmount: simData.loanAmount,
      tenorYears: simData.tenorYears,
      monthlyInstallment: simData.initialMonthlyInstallment,
      dsrPercentage: simData.dsrPercentage,
      affordabilityStatus: simData.affordabilityStatus,
      isPrimary: true,
      createdAt: new Date().toISOString(),
    });
  }

  submitToSpv(customerId: string) {
    const cust = this.customers.find((c) => c.id === customerId);
    if (!cust) return;

    cust.pipelineStatus = "SUBMITTED_TO_SPV";
    this.auditLogs.unshift(
      createAuditLog(
        "SUBMITTED_TO_SPV",
        "Customer",
        customerId,
        { status: "SUBMITTED_TO_SPV" },
        this.currentUser.id,
        this.currentUser.fullName,
        this.currentUser.role
      )
    );
  }

  reviewSpv(
    customerId: string,
    decision: "FORWARD_TO_DEV" | "REVISION" | "DROP",
    notes: string
  ) {
    const cust = this.customers.find((c) => c.id === customerId);
    if (!cust) return;

    cust.spvNotes = notes;
    if (decision === "FORWARD_TO_DEV") {
      cust.pipelineStatus = "SUBMITTED_TO_DEV";
    } else if (decision === "REVISION") {
      cust.pipelineStatus = "REVISION_SPV";
    } else {
      cust.pipelineStatus = "DROPPED";
      // Free unit if any
      if (cust.interestedUnitId) {
        const u = this.units.find((x) => x.id === cust.interestedUnitId);
        if (u && u.status === "HOLD") u.status = "AVAILABLE";
      }
    }

    this.auditLogs.unshift(
      createAuditLog(
        `SPV_REVIEW_${decision}`,
        "Customer",
        customerId,
        { decision, notes },
        this.currentUser.id,
        this.currentUser.fullName,
        this.currentUser.role
      )
    );
  }

  reviewDeveloper(
    customerId: string,
    decision: "APPROVE" | "REVISION" | "REJECT",
    notes: string
  ) {
    const cust = this.customers.find((c) => c.id === customerId);
    if (!cust) return;

    cust.devNotes = notes;
    if (decision === "APPROVE") {
      cust.pipelineStatus = "APPROVED_PENDING_BOOKING";
      // Lock unit to HOLD with 48 hours TTL
      if (cust.interestedUnitId) {
        const unit = this.units.find((u) => u.id === cust.interestedUnitId);
        if (unit) {
          unit.status = "HOLD";
          unit.holdExpiresAt = new Date(Date.now() + 48 * 3600 * 1000).toISOString();
          unit.currentCustomerId = cust.id;
        }
      }
    } else if (decision === "REVISION") {
      cust.pipelineStatus = "REVISION_DEV";
    } else {
      cust.pipelineStatus = "DROPPED";
      // Free unit
      if (cust.interestedUnitId) {
        const unit = this.units.find((u) => u.id === cust.interestedUnitId);
        if (unit && unit.status === "HOLD") {
          unit.status = "AVAILABLE";
          unit.holdExpiresAt = undefined;
          unit.currentCustomerId = undefined;
        }
      }
    }

    this.auditLogs.unshift(
      createAuditLog(
        `DEVELOPER_DECISION_${decision}`,
        "Customer",
        customerId,
        { decision, notes },
        this.currentUser.id,
        this.currentUser.fullName,
        this.currentUser.role
      )
    );
  }

  submitBookingPayment(customerId: string, amount: number, receiptUrl: string) {
    const cust = this.customers.find((c) => c.id === customerId);
    if (!cust) return;

    cust.bookingPayment = {
      amount,
      paymentDate: new Date().toISOString(),
      receiptUrl,
      status: "PENDING",
    };

    this.auditLogs.unshift(
      createAuditLog(
        "BOOKING_PAYMENT_SUBMITTED",
        "Customer",
        customerId,
        { amount, receiptUrl },
        this.currentUser.id,
        this.currentUser.fullName,
        this.currentUser.role
      )
    );
  }

  verifyBookingPayment(customerId: string, isApproved: boolean) {
    const cust = this.customers.find((c) => c.id === customerId);
    if (!cust || !cust.bookingPayment) return;

    if (isApproved) {
      cust.bookingPayment.status = "VERIFIED";
      cust.pipelineStatus = "BOOKED";

      // Lock unit permanently to BOOKED
      if (cust.interestedUnitId) {
        const unit = this.units.find((u) => u.id === cust.interestedUnitId);
        if (unit) {
          unit.status = "BOOKED";
          unit.holdExpiresAt = undefined;
        }
      }

      // Initialize KPR application milestone
      cust.kprMilestone = {
        status: "DOCUMENTS_COLLECTION",
        bankName: "Bank BTN",
      };
    } else {
      cust.bookingPayment.status = "REJECTED";
    }

    this.auditLogs.unshift(
      createAuditLog(
        isApproved ? "BOOKING_VERIFIED" : "BOOKING_REJECTED",
        "Customer",
        customerId,
        { isApproved },
        this.currentUser.id,
        this.currentUser.fullName,
        this.currentUser.role
      )
    );
  }

  updateKprMilestone(
    customerId: string,
    status: MockCustomer["kprMilestone"] extends undefined ? never : NonNullable<MockCustomer["kprMilestone"]>["status"],
    extra?: { sp3kNumber?: string; akadDate?: string }
  ) {
    const cust = this.customers.find((c) => c.id === customerId);
    if (!cust || !cust.kprMilestone) return;

    cust.kprMilestone.status = status;
    if (extra?.sp3kNumber) cust.kprMilestone.sp3kNumber = extra.sp3kNumber;
    if (extra?.akadDate) cust.kprMilestone.akadDate = extra.akadDate;

    if (status === "AKAD_COMPLETED") {
      cust.pipelineStatus = "AKAD_COMPLETED";
      // Unit transitions to SOLD
      if (cust.interestedUnitId) {
        const unit = this.units.find((u) => u.id === cust.interestedUnitId);
        if (unit) {
          unit.status = "SOLD";
        }
      }
    } else {
      cust.pipelineStatus = "KPR_PROCESSING";
    }

    this.auditLogs.unshift(
      createAuditLog(
        "KPR_MILESTONE_UPDATED",
        "Customer",
        customerId,
        { status, ...extra },
        this.currentUser.id,
        this.currentUser.fullName,
        this.currentUser.role
      )
    );
  }
}

// Global Singleton Instance
export const store = new KavlingStore();
