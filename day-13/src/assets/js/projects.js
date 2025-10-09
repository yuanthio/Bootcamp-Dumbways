const form = document.querySelector("form");
const alertBoxAdd = document.querySelector(".alert");
const alertBoxDelete = document.querySelector(".alertDelete");
let containerCard = document.querySelector(".list-projects");
let datas = [];
let id = 0;

window.addEventListener("load", function () {
    const saved = JSON.parse(localStorage.getItem("projects")) || [];
    datas = saved;
    if (datas.length > 0) {
        id = datas[datas.length - 1].id; 
        let containerCard = document.querySelector(".list-projects");
        containerCard.innerHTML = tampilCard(datas);
    }
});

form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("nama").value;
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    const message = document.getElementById("message").value;

    const fileInput = document.getElementById("formFile").files[0];
    const image = fileInput ? await toBase64(fileInput) : "";

    const checkbox = document.querySelectorAll("input[type='checkbox']:checked");
    const teknologi = Array.from(checkbox).map(cb => cb.nextElementSibling.innerText);

    id = id + 1;

    const data = { id, name, startDate, endDate, message, teknologi, image };
    datas.push(data);

    localStorage.setItem("projects", JSON.stringify(datas));

    containerCard.innerHTML = tampilCard(datas);

    alertBoxAdd.style.display = 'block';
    setTimeout(function() {
        alertBoxAdd.style.display = 'none';
    }, 4000)

    form.reset();
});

function deleteCard(e, idHapus) {
    e.preventDefault();

    datas = datas.filter(dt => dt.id !== idHapus);

    localStorage.setItem("projects", JSON.stringify(datas));

    containerCard.innerHTML = tampilCard(datas);

    alertBoxDelete.style.display = 'block';
    setTimeout(function() {
        alertBoxDelete.style.display = 'none';
    }, 4000)
}

function tampilCard(datas) {
    return datas.map(dt =>
        `<div class="col-lg-4 col-md-6">
            <div class="card">
                <img src="${dt.image}" class="card-img-top img-fluid" alt="${dt.name}">
                <div class="card-body">
                    <h5 class="card-title fw-bold">${dt.name}</h5>
                    <h6 class="card-subtitle mb-2 text-body-secondary">${dt.startDate} - ${dt.endDate}</h6>
                    <p class="card-text my-4">${dt.message}</p>
                    <div class="icon mb-4">
                        ${dt.teknologi.map(tli => {
                            if (tli === "Node JS") {
                                return `<span class="me-3"><i class="fs-3 fa-brands fa-node-js"></i></span>`;
                            } else if (tli === "Vue JS") {
                                return `<span class="me-3"><i class="fs-3 fa-brands fa-vuejs"></i></span>`;
                            } else if (tli === "Golang") {
                                return `<span class="me-3"><i class="fs-3 fa-brands fa-golang"></i></span>`;
                            } else {
                                return `<span class="me-3"><i class="fs-3 fa-brands fa-python"></i></span>`;
                            }
                        }).join("")}
                    </div>
                    <div class="row gx-1 gy-md-2 gy-sm-2 btns">
                        <div class="col-lg-6 d-grid">
                            <a class="btn btn-dark" href="/detail?id=${dt.id}" role="button">
                                <i class="fa-solid fa-circle-info"></i> Detail
                            </a>
                        </div>
                        <div class="col-lg-6 d-grid">
                            <a class="btn btn-dark" href="#" role="button" onClick="deleteCard(event, ${dt.id})">
                                <i class="fa-solid fa-trash"></i> Hapus
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
    ).join("");
}

function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
}