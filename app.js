const kpiData = {
  id: "kpi-1",
  name: "Strategic Goals Portfolio (2000-2001)",
  owner: "Avery Chen — Chief Strategy Officer",
  target: "FY01 targets",
  value: "Tracking",
  trend: "Mixed signal",
  severity: "high",
  children: [
    {
      id: "kpi-1-1",
      name: "Diversify into new commodity markets beyond energy",
      owner: "Avery Chen — Chief Strategy Officer",
      target: "4 new markets",
      value: "2 launched",
      trend: "Behind plan",
      severity: "high",
      children: [
        {
          id: "kpi-1-1-1",
          name: "Launch bandwidth/telecom commodity trading (Enron Broadband)",
          owner: "Elena Torres — VP, Broadband Ventures",
          target: "Q3 launch",
          value: "Pilot live",
          trend: "At risk",
          severity: "high",
          children: []
        },
        {
          id: "kpi-1-1-2",
          name: "Launch credit derivatives trading (EnronCredit.com)",
          owner: "Daniel Brooks — SVP, Capital Markets",
          target: "Q2 launch",
          value: "Delayed",
          trend: "Behind schedule",
          severity: "critical",
          children: []
        },
        {
          id: "kpi-1-1-3",
          name: "Build emissions trading market",
          owner: "Maya Singh — Director, Environmental Products",
          target: "3 anchor clients",
          value: "1 secured",
          trend: "Slow uptake",
          severity: "medium",
          children: []
        }
      ]
    },
    {
      id: "kpi-1-2",
      name: "Dominate North American gas and power markets",
      owner: "Jordan Alvarez — EVP, Enron North America",
      target: "Top 3 share",
      value: "Top 5",
      trend: "Down 1 rank",
      severity: "high",
      children: []
    },
    {
      id: "kpi-1-3",
      name: "Secure LNG terminal access (Cove Point)",
      owner: "Hannah Lee — VP, Global LNG",
      target: "Access secured",
      value: "Pending approvals",
      trend: "Delayed",
      severity: "medium",
      children: []
    },
    {
      id: "kpi-1-4",
      name: "Expand domestic power generation portfolio",
      owner: "Marcus Reed — SVP, Power Development",
      target: "5 GW",
      value: "3.6 GW",
      trend: "On track",
      severity: "low",
      children: []
    },
    {
      id: "kpi-1-5",
      name: "Optimize physical gas trading operations",
      owner: "Nora Patel — Head of Gas Trading Ops",
      target: "10% margin lift",
      value: "6% lift",
      trend: "Improving",
      severity: "medium",
      children: []
    },
    {
      id: "kpi-1-6",
      name: "Resolve Dabhol Power Project payment crisis (India)",
      owner: "Arjun Menon — VP, International Power",
      target: "Payment plan",
      value: "Negotiating",
      trend: "Escalated",
      severity: "critical",
      children: [

        {
          id: "kpi-1-6-1",
          name: "Finalize payment restructuring term sheet",
          owner: "Neha Kapoor — Director, Project Finance",
          target: "Signed term sheet",
          value: "Draft under review",
          trend: "At risk",
          severity: "high",
          children: []
        },
        {
          id: "kpi-1-6-2",
          name: "Government of Maharashtra stakeholder alignment",
          owner: "Ravi Iyer — VP, Government Affairs",
          target: "Alignment secured",
          value: "In negotiation",
          trend: "Delayed",
          severity: "critical",
          children: []
        },
        {
          id: "kpi-1-6-3",
          name: "Fuel supply continuity",
          owner: "Priya Desai — Head of Fuel Procurement",
          target: "No disruptions",
          value: "Stable",
          trend: "Monitoring",
          severity: "medium",
          children: []
        },
        {
          id: "kpi-1-6-4",
          name: "Legal dispute exposure",
          owner: "Cameron Blake — General Counsel",
          target: "No escalation",
          value: "Contained",
          trend: "Improving",
          severity: "low",
          children: []
        }
      ]
    },
    {
      id: "kpi-1-7",
      name: "Navigate California energy crisis",
      owner: "Sophia Grant — SVP, Regulatory Affairs",
      target: "Stabilize exposure",
      value: "Volatile",
      trend: "Uncertain",
      severity: "high",
      children: []
    },
    {
      id: "kpi-1-8",
      name: "Influence FERC on market structure and price caps",
      owner: "Claire Donovan — VP, Government Relations",
      target: "Policy alignment",
      value: "Partial",
      trend: "In progress",
      severity: "medium",
      children: []
    },
    {
      id: "kpi-1-9",
      name: "Preserve direct access for electricity customers",
      owner: "Sophia Grant — SVP, Regulatory Affairs",
      target: "Access preserved",
      value: "At risk",
      trend: "Headwinds",
      severity: "high",
      children: []
    },
    {
      id: "kpi-1-10",
      name: "Win new generation capacity contracts in California",
      owner: "Rafael Ortiz — Director, Power Origination",
      target: "2 contracts",
      value: "1 in review",
      trend: "Behind plan",
      severity: "medium",
      children: []
    },
    {
      id: "kpi-1-11",
      name: "Reduce operating costs by 10% by Q3 2001",
      owner: "Olivia Chen — COO",
      target: "10% reduction",
      value: "4% achieved",
      trend: "Tracking",
      severity: "medium",
      children: []
    },
    {
      id: "kpi-1-12",
      name: "Launch eProcurement system",
      owner: "Ethan Wallace — VP, IT Transformation",
      target: "Q3 rollout",
      value: "Design complete",
      trend: "On track",
      severity: "low",
      children: []
    },
    {
      id: "kpi-1-13",
      name: "Create EGAS business unit for international focus",
      owner: "Isabel Moore — VP, International Gas",
      target: "Org live",
      value: "Staffing 70%",
      trend: "Slight delay",
      severity: "medium",
      children: []
    },
    {
      id: "kpi-1-14",
      name: "Build global risk management function",
      owner: "Victor Chan — Chief Risk Officer",
      target: "Global model",
      value: "Phase 1",
      trend: "In progress",
      severity: "low",
      children: []
    },
    {
      id: "kpi-1-15",
      name: "Shape national environmental legislation (Clean Power Group)",
      owner: "Leah Park — Head of Public Policy",
      target: "Coalition alignment",
      value: "Drafting",
      trend: "Early",
      severity: "low",
      children: []
    },
    {
      id: "kpi-1-16",
      name: "Prepare for California-related litigation",
      owner: "Cameron Blake — General Counsel",
      target: "Ready by Q2",
      value: "Briefing 60%",
      trend: "In progress",
      severity: "medium",
      children: []
    }
  ]
};

const kpiList = document.getElementById("kpiList");
const detailSection = document.getElementById("detail");
const overviewSection = document.getElementById("overview");
const detailTitle = document.getElementById("detailTitle");
const detailMeta = document.getElementById("detailMeta");
const upperKpi = document.getElementById("upperKpi");
const currentKpi = document.getElementById("currentKpi");
const lowerKpis = document.getElementById("lowerKpis");
const integrationsBtn = document.getElementById("integrationsBtn");
const homeBtn = document.getElementById("homeBtn");
const pageTitle = document.getElementById("pageTitle");
const integrationsSection = document.getElementById("integrations");
const integrationGrid = document.getElementById("integrationGrid");
const sortBtn = document.getElementById("sortBtn");

const severityRank = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4
};

let severitySortDesc = true;

const integrations = [
  {
    name: "Email",
    logo: `
      <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
        <rect x="6" y="12" width="36" height="24" rx="6" fill="#E1D7FF" />
        <path d="M9 16l15 11 15-11" stroke="#5E3BE1" stroke-width="2.6" fill="none" />
      </svg>
    `,
    status: true
  },
  {
    name: "Slack",
    logo: `
      <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
        <rect x="9" y="20" width="10" height="18" rx="5" fill="#36C5F0"/>
        <rect x="29" y="10" width="10" height="18" rx="5" fill="#2EB67D"/>
        <rect x="20" y="29" width="18" height="10" rx="5" fill="#ECB22E"/>
        <rect x="10" y="9" width="18" height="10" rx="5" fill="#E01E5A"/>
      </svg>
    `,
    status: true
  },
  {
    name: "Microsoft Teams",
    logo: `
      <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
        <rect x="8" y="12" width="26" height="24" rx="6" fill="#635BFF"/>
        <rect x="28" y="16" width="12" height="16" rx="5" fill="#8B83FF"/>
        <text x="18" y="29" text-anchor="middle" font-size="12" font-weight="700" fill="#fff">T</text>
      </svg>
    `,
    status: false
  },
  {
    name: "Jira",
    logo: `
      <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
        <path d="M10 16l14-12 14 12-14 12z" fill="#0052CC"/>
        <path d="M14 28l10-8 10 8-10 8z" fill="#2684FF"/>
      </svg>
    `,
    status: true
  },
  {
    name: "Asana",
    logo: `
      <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
        <circle cx="16" cy="22" r="8" fill="#FF5D5B"/>
        <circle cx="32" cy="22" r="8" fill="#FF5D5B"/>
        <circle cx="24" cy="34" r="8" fill="#FF5D5B"/>
      </svg>
    `,
    status: false
  },
  {
    name: "Notion",
    logo: `
      <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
        <rect x="9" y="8" width="30" height="32" rx="6" fill="#fff" stroke="#111" stroke-width="2.4"/>
        <text x="24" y="31" text-anchor="middle" font-size="14" font-weight="700" fill="#111">N</text>
      </svg>
    `,
    status: true
  },
  {
    name: "Salesforce",
    logo: `
      <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
        <circle cx="20" cy="26" r="10" fill="#00A1E0"/>
        <circle cx="28" cy="22" r="10" fill="#00A1E0"/>
        <circle cx="34" cy="28" r="8" fill="#00A1E0"/>
      </svg>
    `,
    status: false
  },
  {
    name: "Zendesk",
    logo: `
      <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
        <path d="M10 12h28L24 28z" fill="#03363D"/>
        <path d="M10 36h28L24 20z" fill="#03363D"/>
      </svg>
    `,
    status: true
  }
];

function flattenKpis(node, parent = null, list = []) {
  list.push({ ...node, parent });
  node.children.forEach((child) => flattenKpis(child, node, list));
  return list;
}

const allKpis = flattenKpis(kpiData);

function severityColor(severity) {
  switch (severity) {
    case "critical":
      return "var(--critical)";
    case "high":
      return "var(--high)";
    case "medium":
      return "var(--med)";
    default:
      return "var(--low)";
  }
}

function parseOwner(owner) {
  const [namePart, titlePart] = owner.split(" — ");
  const name = namePart ? namePart.trim() : owner.trim();
  const title = titlePart ? titlePart.trim() : "";
  const email =
    name
      .toLowerCase()
      .replace(/[^a-z\\s]/g, "")
      .trim()
      .replace(/\\s+/g, ".") + "@enron.com";
  return { name, title, email };
}

function ownerMarkup(owner) {
  const { name, title, email } = parseOwner(owner);
  const titleText = title ? ` · ${title}` : "";
  return `
    <span class="owner-wrap">
      <span class="owner-name">${name}</span>
      <span class="owner-title">${titleText}</span>
      <span class="owner-pop">
        <span>${name}</span>
        ${title ? `<span class="owner-role">${title}</span>` : ""}
        <a class="owner-action" href="mailto:${email}">Contact</a>
      </span>
    </span>
  `;
}

function badge(severity) {
  return `<span class="badge ${severity}">${severity}</span>`;
}

function renderCard(kpi, clickable = true) {
  const detail = clickable ? "data-kpi" : "";
  return `
    <div class="kpi-card" ${detail}="${kpi.id}">
      <div class="kpi-title">
        <span>${kpi.name}</span>
        ${badge(kpi.severity)}
      </div>
      <div class="kpi-sub">Owner: ${ownerMarkup(kpi.owner)}</div>
      <div class="kpi-sub">Target ${kpi.target} · Current ${kpi.value}</div>
      <div class="risk-line">
        <span class="risk-dot" style="background:${severityColor(kpi.severity)}"></span>
        <span class="kpi-sub">${kpi.trend}</span>
      </div>
    </div>
  `;
}

function renderOverview() {
  const items = [...kpiData.children].sort((a, b) => {
    return severitySortDesc
      ? severityRank[b.severity] - severityRank[a.severity]
      : severityRank[a.severity] - severityRank[b.severity];
  });

  kpiList.innerHTML = items.map((child) => renderCard(child)).join("");
}

function renderIntegrations() {
  integrationGrid.innerHTML = integrations
    .map(
      (tool, index) => `
      <div class="integration-card">
        <div class="integration-title">
          <div class="integration-name">
            <span class="integration-logo" aria-hidden="true">${tool.logo}</span>
            <span>${tool.name}</span>
          </div>
          <span class="badge ${tool.status ? "connected" : "off"}">${tool.status ? "Connected" : "Off"}</span>
        </div>
        <label class="toggle">
          <input type="checkbox" data-integration="${index}" ${tool.status ? "checked" : ""} />
        </label>
      </div>
    `
    )
    .join("");
}

function renderDetail(kpi) {
  detailTitle.textContent = kpi.name;
  detailMeta.innerHTML = `
    <span class="pill">Owner: ${ownerMarkup(kpi.owner)}</span>
    <span class="pill">Target: ${kpi.target}</span>
    <span class="pill">Current: ${kpi.value}</span>
    <span class="pill">${kpi.trend}</span>
  `;

  if (kpi.parent) {
    upperKpi.innerHTML = renderCard(kpi.parent, true);
  } else {
    upperKpi.innerHTML = `<div class="kpi-sub">This KPI is the top of the hierarchy.</div>`;
  }

  currentKpi.innerHTML = `
    <strong>${kpi.name}</strong>
    <div class="kpi-sub">Owner: ${ownerMarkup(kpi.owner)}</div>
    <div class="kpi-sub">Target ${kpi.target} · Current ${kpi.value}</div>
    <div class="risk-line">
      <span class="risk-dot" style="background:${severityColor(kpi.severity)}"></span>
      <span class="kpi-sub">${kpi.severity.toUpperCase()} · ${kpi.trend}</span>
    </div>
  `;

  if (kpi.children.length) {
    lowerKpis.innerHTML = kpi.children
      .map((child) => renderCard(child, true))
      .join("");
  } else {
    lowerKpis.innerHTML = `<div class="kpi-sub">No lower-level KPIs. This is a root driver.</div>`;
  }

}

function showDetail(kpiId) {
  const kpi = allKpis.find((item) => item.id === kpiId);
  if (!kpi) return;

  renderDetail(kpi);
  detailSection.classList.add("active");
  overviewSection.style.display = "none";
  integrationsSection.classList.remove("active");
  pageTitle.textContent = "Chief";
}

function showOverview() {
  detailSection.classList.remove("active");
  overviewSection.style.display = "grid";
  integrationsSection.classList.remove("active");
  pageTitle.textContent = "Chief";
}

function showIntegrations() {
  detailSection.classList.remove("active");
  overviewSection.style.display = "none";
  integrationsSection.classList.add("active");
  pageTitle.textContent = "Integrations";
}

function handleClick(event) {
  const card = event.target.closest("[data-kpi]");
  if (card) {
    showDetail(card.dataset.kpi);
  }
}

function handleIntegrationToggle(event) {
  const toggle = event.target.closest("input[data-integration]");
  if (!toggle) return;

  const index = Number(toggle.dataset.integration);
  if (Number.isNaN(index) || !integrations[index]) return;

  integrations[index].status = toggle.checked;
  renderIntegrations();
}

renderOverview();
renderIntegrations();

document.body.addEventListener("click", handleClick);
integrationsBtn.addEventListener("click", showIntegrations);
homeBtn.addEventListener("click", showOverview);
integrationGrid.addEventListener("change", handleIntegrationToggle);
if (sortBtn) {
  sortBtn.addEventListener("click", () => {
    severitySortDesc = !severitySortDesc;
    sortBtn.textContent = `Sort: Severity ${severitySortDesc ? "↓" : "↑"}`;
    renderOverview();
  });
}
