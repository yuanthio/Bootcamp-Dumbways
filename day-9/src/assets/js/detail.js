const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get("id"));

const datas = JSON.parse(localStorage.getItem("projects")) || [];

const project = datas.find(p => p.id === id);

if (project) {
    document.querySelector(".detail h3").textContent = project.name;

    const img = document.querySelector(".detail img");
    img.src = project.image;
    img.alt = project.name;

    const durasiContainer = document.querySelector(".durasi");
    durasiContainer.innerHTML = `
        <h5>Durasi</h5>
        <h6 class="card-title"><i class="fs-3 fa-solid fa-calendar-week"></i> ${project.startDate} - ${project.endDate}</h6>
      `;

    const techContainer = document.querySelector(".teknologi");
    techContainer.innerHTML = `
        <h5>Teknologi</h5>
        ${project.teknologi.map(tli => {
        if (tli === "Node JS") {
            return `<div class="col-lg-6 col-md-6"><h6><i class="fs-3 fa-brands fa-node-js"></i> Node JS</h6></div>`;
        } else if (tli === "Vue JS") {
            return `<div class="col-lg-6 col-md-6"><h6><i class="fs-3 fa-brands fa-vuejs"></i> Vue JS</h6></div>`;
        } else if (tli === "Golang") {
            return `<div class="col-lg-6 col-md-6"><h6><i class="fs-3 fa-brands fa-golang"></i> Golang</h6></div>`;
        } else {
            return `<div class="col-lg-6 col-md-6"><h6><i class="fs-3 fa-brands fa-python"></i> Python</h6></div>`;
        }
    }).join("")}
      `;

    const descContainer = document.querySelector(".deskripsi");
    descContainer.innerHTML = `<p>${project.message}</p>`;
} else {
    document.querySelector(".detail").innerHTML = "<h3 class='text-center'>Project tidak ditemukan<i class='fa-solid fa-xmark'></i></h3>";
}