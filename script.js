
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
    keuangan: "Keuangan Santri",
    "tambah-santri": "Tambah Nama Santri"
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

function isAdmin() {
    return document.getElementById("user-role").value === "admin";
}

function editableField(value, index, field, type = "text") {
    if (!isAdmin()) return escapeHTML(value);

    const numeric = type === "number";
    const limit = ["fiqih", "tajwid", "arab", "hafalan"].includes(field)
        ? ' min="0" max="100"'
        : numeric ? ' min="0"' : "";

    return `<input class="data-input" type="${type}" value="${escapeHTML(value)}" required
        data-index="${index}" data-field="${field}" aria-label="Ubah ${field}"
        ${numeric ? 'step="1"' : ""}${limit}>`;
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
                <td>${editableField(s.nama, index, "nama")}</td>
                <td>${editableField(s.kelas, index, "kelas")}</td>
                <td>
                    ${isAdmin()
                        ? `<select class="attendance-select"
                            data-index="${index}"
                            aria-label="Status ${escapeHTML(s.nama)}">
                            ${["Hadir", "Izin", "Sakit", "Alfa"].map(status => `
                                <option value="${status}"
                                    ${s.status === status ? "selected" : ""}>
                                    ${status}
                                </option>
                            `).join("")}
                        </select>`
                        : statusBadge(s.status)}
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
                    <td>${editableField(s.nama, index, "nama")}</td>
                    <td>${editableField(s.fiqih, index, "fiqih", "number")}</td>
                    <td>${editableField(s.tajwid, index, "tajwid", "number")}</td>
                    <td>${editableField(s.arab, index, "arab", "number")}</td>
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
        santri.map((s, index) => `
            <article class="hafalan-card">
                <h3>${editableField(s.nama, index, "nama")}</h3>
                <p>${editableField(s.kelas, index, "kelas")} ·
                    ${editableField(s.juz, index, "juz")}</p>

                <div class="progress-track">
                    <div class="progress-fill"
                        style="width: ${s.hafalan}%"></div>
                </div>

                <div class="progress-info">
                    <span>Progres hafalan</span>
                    <span>${editableField(s.hafalan, index, "hafalan", "number")}%</span>
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
                <td>${editableField(s.nama, index, "nama")}</td>
                <td>${editableField(s.kelas, index, "kelas")}</td>
                <td>${isAdmin()
                    ? editableField(s.tagihan, index, "tagihan", "number")
                    : formatRupiah(s.tagihan)}</td>
                <td>${isAdmin()
                    ? editableField(s.dibayar, index, "dibayar", "number")
                    : formatRupiah(s.dibayar)}</td>
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

function renderAllData() {
    renderDashboardAttendance();
    renderAttendanceTable();
    renderGrades();
    renderHafalan();
    renderKeuangan();
    updateAttendanceSummary();
}

function updateRoleDisplay() {
    const admin = isAdmin();
    document.querySelector(".sidebar-bottom strong").textContent =
        admin ? "Admin Pesantren" : "Orang Tua Santri";
    document.querySelector(".avatar").textContent = admin ? "A" : "O";
    document.querySelector(".demo-label").textContent = admin
        ? "● Mode Admin: dapat mengedit semua data"
        : "● Mode Orang Tua: hanya melihat data";
    document.getElementById("add-student-link").hidden = !admin;

    if (!admin && document.getElementById("tambah-santri").classList.contains("active")) {
        showPage("dashboard");
    }

    renderAllData();
}

function showPage(pageId) {
    if (!pageNames[pageId]) return;
    if (pageId === "tambah-santri" && !isAdmin()) return;

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

function tambahOpsiKelas(namaKelasBaru) {
    const selectKelas = document.getElementById("student-class");

    const opsiAda = Array.from(selectKelas.options).some(option => option.value === namaKelasBaru);
    
    if (!opsiAda && namaKelasBaru.trim() !== "") {
        const opsiBaru = document.createElement("option");
        opsiBaru.value = namaKelasBaru;
        opsiBaru.textContent = namaKelasBaru;
        
        selectKelas.appendChild(opsiBaru);
    }
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

// Peran hanya mengatur tampilan pada prototipe ini; tidak menggantikan autentikasi server.
document.getElementById("user-role")
    .addEventListener("change", updateRoleDisplay);

document.getElementById("add-student-form")
    .addEventListener("submit", event => {
        event.preventDefault();
        if (!isAdmin()) return;

        const form = event.currentTarget;
        const formData = new FormData(form);
        const nama = formData.get("nama").trim();
        const kelas = formData.get("kelas").trim();
        const gender = formData.get("gender");
        const ortu = formData.get("ortu").trim();
        const telepon = formData.get("telepon").trim();
        const kota = formData.get("kota");
        const alamat = formData.get("alamat").trim();
        const feedback = document.getElementById("add-student-feedback");

        if (!nama || !kelas || !gender || !ortu || !telepon || !kota || !alamat) {
            feedback.textContent = "Semua kolom data wajib diisi";
            return;
        }

        santri.push({
            nama,
            kelas,
            gender,
            ortu,
            telepon,
            kota,
            alamat,
            status: "Izin",
            fiqih: 0,
            tajwid: 0,
            arab: 0,
            hafalan: 0,
            juz: "Belum ditentukan",
            tagihan: 0,
            dibayar: 0
        });

        form.reset();
        renderAllData();
        feedback.textContent = `${nama} (Asal ${kota}) berhasil ditambahkan ke daftar santri.`;
    });

document.addEventListener("change", event => {
    const target = event.target;

    if (target.matches(".attendance-select")) {
        if (!isAdmin()) return;

        const index = Number(target.dataset.index);
        if (!Number.isInteger(index) || !santri[index]) return;

        santri[index].status = target.value;
        renderAllData();
        return;
    }

    if (!target.matches(".data-input") || !isAdmin()) return;

    const index = Number(target.dataset.index);
    const field = target.dataset.field;
    const editableFields = [
        "nama", "kelas", "fiqih", "tajwid", "arab",
        "hafalan", "juz", "tagihan", "dibayar"
    ];

    if (!Number.isInteger(index) || !santri[index] ||
        !editableFields.includes(field)) return;

    const newValue = target.type === "number"
        ? Number(target.value)
        : target.value;
    if ((field === "dibayar" && newValue > santri[index].tagihan) ||
        (field === "tagihan" && newValue < santri[index].dibayar)) {
        target.setCustomValidity("Pembayaran tidak boleh melebihi jumlah tagihan.");
        target.reportValidity();
        target.setCustomValidity("");
        return;
    }

    if (!target.reportValidity()) return;

    santri[index][field] = newValue;
    renderAllData();
});

document.getElementById("btn-add-class").addEventListener("click", () => {
    const inputBaru = document.getElementById("new-class-input");
    const namaKelas = inputBaru.value.trim();
    
    if (namaKelas) {
        tambahOpsiKelas(namaKelas);
        
        // Otomatis pilih kelas yang baru saja ditambahkan
        const selectKelas = document.getElementById("student-class");
        selectKelas.value = namaKelas;
        
        // Bersihkan input
        inputBaru.value = "";
    }
});

// Menampilkan tanggal hari ini
const tanggal = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
});

updateRoleDisplay();
