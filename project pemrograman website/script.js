
const santri = [
    {
        nama: "Ahmad Fauzan",
        kelas: "Tahfidz A",
        status: "Hadir",
        fiqih: 88,
        tajwid: 90,
        arab: 85,
        hafalan: 75,
        juz: "Juz 30",
        tagihan: 450000,
        dibayar: 350000
    },
    {
        nama: "Muhammad Rizki",
        kelas: "Tahfidz A",
        status: "Hadir",
        fiqih: 85,
        tajwid: 87,
        arab: 89,
        hafalan: 60,
        juz: "Juz 30",
        tagihan: 420000,
        dibayar: 420000
    },
    {
        nama: "Abdullah Naufal",
        kelas: "Tahfidz B",
        status: "Izin",
        fiqih: 80,
        tajwid: 84,
        arab: 86,
        hafalan: 50,
        juz: "Juz 29",
        tagihan: 480000,
        dibayar: 300000
    },
    {
        nama: "Abdurrahman Hakim",
        kelas: "Tahfidz B",
        status: "Hadir",
        fiqih: 92,
        tajwid: 88,
        arab: 90,
        hafalan: 75,
        juz: "Juz 29",
        tagihan: 500000,
        dibayar: 500000
    }
];

const pageNames = {
    dashboard: "Dashboard",
    absensi: "Absensi",
    akademik: "Nilai Akademik",
    hafalan: "Hafalan Al-Qur'an",
    keuangan: "Keuangan Santri"
};

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

function statusBadge(status) {
    return `<span class="status ${status.toLowerCase()}">
        ${escapeHTML(status)}
    </span>`;
}

function renderDashboardAttendance() {
    document.getElementById("dashboard-attendance").innerHTML =
        santri.map(s => `
            <tr>
                <td>${escapeHTML(s.nama)}</td>
                <td>${escapeHTML(s.kelas)}</td>
                <td>${statusBadge(s.status)}</td>
            </tr>
        `).join("");
}

function renderAttendanceTable() {
    document.getElementById("attendance-table").innerHTML =
        santri.map((s, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${escapeHTML(s.nama)}</td>
                <td>${escapeHTML(s.kelas)}</td>
                <td>
                    <select class="attendance-select"
                        data-index="${index}"
                        aria-label="Status ${escapeHTML(s.nama)}">
                        ${["Hadir", "Izin", "Sakit", "Alfa"].map(status => `
                            <option value="${status}"
                                ${s.status === status ? "selected" : ""}>
                                ${status}
                            </option>
                        `).join("")}
                    </select>
                </td>
            </tr>
        `).join("");
}

function renderGrades() {
    document.getElementById("grades-table").innerHTML =
        santri.map((s, index) => {
            const rataRata = (s.fiqih + s.tajwid + s.arab) / 3;

            return `
                <tr>
                    <td>${index + 1}</td>
                    <td>${escapeHTML(s.nama)}</td>
                    <td>${s.fiqih}</td>
                    <td>${s.tajwid}</td>
                    <td>${s.arab}</td>
                    <td>
                        <strong>${rataRata.toLocaleString("id-ID", {
                            minimumFractionDigits: 1,
                            maximumFractionDigits: 1
                        })}</strong>
                    </td>
                </tr>
            `;
        }).join("");

    const rataNilai = santri.reduce(
        (total, s) => total + s.fiqih + s.tajwid + s.arab, 0
    ) / (santri.length * 3);

    document.getElementById("average-grade").textContent =
        rataNilai.toLocaleString("id-ID", {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
        });
}

function renderHafalan() {
    const rataHafalan = Math.round(
        santri.reduce((total, s) => total + s.hafalan, 0) / santri.length
    );

    document.getElementById("average-hafalan").textContent =
        rataHafalan + "%";

    document.getElementById("dashboard-hafalan").innerHTML =
        santri.slice(0, 3).map(s => `
            <div class="progress-item">
                <div class="progress-info">
                    <span>${escapeHTML(s.nama)}</span>
                    <span>${s.hafalan}%</span>
                </div>
                <div class="progress-track">
                    <div class="progress-fill"
                        style="width: ${s.hafalan}%"></div>
                </div>
            </div>
        `).join("");

    document.getElementById("hafalan-cards").innerHTML =
        santri.map(s => `
            <article class="hafalan-card">
                <h3>${escapeHTML(s.nama)}</h3>
                <p>${escapeHTML(s.kelas)} · ${escapeHTML(s.juz)}</p>

                <div class="progress-track">
                    <div class="progress-fill"
                        style="width: ${s.hafalan}%"></div>
                </div>

                <div class="progress-info">
                    <span>Progres hafalan</span>
                    <span>${s.hafalan}%</span>
                </div>
            </article>
        `).join("");
}

function formatRupiah(value) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(value);
}

function renderKeuangan() {
    const totalTagihan = santri.reduce((total, s) => total + s.tagihan, 0);
    const totalDibayar = santri.reduce((total, s) => total + s.dibayar, 0);
    const totalSisa = totalTagihan - totalDibayar;

    document.getElementById("total-tagihan").textContent = formatRupiah(totalTagihan);
    document.getElementById("total-dibayar").textContent = formatRupiah(totalDibayar);
    document.getElementById("total-sisa").textContent = formatRupiah(totalSisa);

    document.getElementById("finance-table").innerHTML = santri.map((s, index) => {
        const sisa = s.tagihan - s.dibayar;
        const status = sisa === 0 ? "Lunas" : sisa <= 200000 ? "Tersisa" : "Belum Lunas";

        return `
            <tr>
                <td>${index + 1}</td>
                <td>${escapeHTML(s.nama)}</td>
                <td>${escapeHTML(s.kelas)}</td>
                <td>${formatRupiah(s.tagihan)}</td>
                <td>${formatRupiah(s.dibayar)}</td>
                <td>${formatRupiah(sisa)}</td>
                <td>
                    <span class="status ${status.toLowerCase().replace(/\s+/g, "-")}">
                        ${escapeHTML(status)}
                    </span>
                </td>
            </tr>
        `;
    }).join("");
}

function updateAttendanceSummary() {
    const jumlahHadir = santri.filter(
        s => s.status === "Hadir"
    ).length;

    document.getElementById("total-santri").textContent =
        santri.length;

    document.getElementById("total-hadir").textContent =
        jumlahHadir;
}

function showPage(pageId) {
    if (!pageNames[pageId]) return;

    document.querySelectorAll(".page").forEach(page => {
        page.classList.toggle("active", page.id === pageId);
    });

    document.querySelectorAll(".nav-link").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.page === pageId
        );
    });

    document.getElementById("page-title").textContent =
        pageNames[pageId];

    document.getElementById("breadcrumb").textContent =
        pageNames[pageId];

    window.scrollTo({ top: 0, behavior: "smooth" });
}

// Navigasi menu
document.querySelectorAll(".nav-link").forEach(button => {
    button.addEventListener("click", () => {
        showPage(button.dataset.page);
    });
});

// Tombol navigasi dari dashboard
document.querySelectorAll("[data-go]").forEach(button => {
    button.addEventListener("click", () => {
        showPage(button.dataset.go);
    });
});

// Mengubah status absensi
document.getElementById("attendance-table")
    .addEventListener("change", event => {
        const select = event.target.closest(".attendance-select");

        if (!select) return;

        const index = Number(select.dataset.index);

        if (!Number.isInteger(index) || !santri[index]) return;

        santri[index].status = select.value;

        updateAttendanceSummary();
        renderDashboardAttendance();
    });

// Menampilkan tanggal hari ini
const tanggal = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
});

document.querySelector(".demo-label").textContent =
    "● Mode Demonstrasi";

renderDashboardAttendance();
renderAttendanceTable();
renderGrades();
renderHafalan();
renderKeuangan();
updateAttendanceSummary();
