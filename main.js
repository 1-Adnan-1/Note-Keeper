// ! Ay  Dizisi
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// ! HTML den İlgili Elemanların Çekilmesi
const addBox = document.querySelector(".add-box");
const popupBoxContainer = document.querySelector(".popup-box");
const popupBox = document.querySelector(".popup-box .popup");
const popupTitle = popupBox.querySelector("header p");
const closeIcon = popupBox.querySelector("header i");
const form = document.querySelector("form");
const settings = document.querySelector(".settings");
const wrapper = document.querySelector(".wrapper");
const button = document.querySelector(".popup button");

// Not güncellemesi için değişkenlerin oluşturulması

let isUpdate = false;
let updateId;

// * Localstorage'dan notları çekme

let notes = JSON.parse(localStorage.getItem("notes")) || [];

// * Ekle iconuna tıklayınca popup açılsın
addBox.addEventListener("click", () => {
  // Popup ı görünür kıldık
  popupBoxContainer.classList.add("show");
  popupBox.classList.add("show");

  // Sayfa kaydırılmasını engelle
  document.querySelector("body").style.overflow = "hidden";
});

// * Kapat iconuna tıklayınca popup kapansın
closeIcon.addEventListener("click", () => {
  // Popup ı kaldır
  popupBoxContainer.classList.remove("show");
  popupBox.classList.remove("show");
  // Sayfa kaydırılmasını aktif et
  document.querySelector("body").style.overflow = "auto";
});

// ! Form gönderildiğinde çalışacak fonksiyon
form.addEventListener("submit", (e) => {
  // Sayfa yenilemeyi iptal ettik
  e.preventDefault();
  // Inputlardaki değerlere eriştik
  let titleInput = e.target[0];
  let descriptionInput = e.target[1];
  // Boşlukları temizledik
  let title = titleInput.value.trim();
  let description = descriptionInput.value.trim();
  //Inputların boş olma durumunu kontrol ettik eğer doluysa bir not objesi oluşturduk ve bunu locale gönderdik.
  if (title && description) {
    const date = new Date();
    let month = months[date.getMonth()];
    let day = date.getDate();
    let year = date.getFullYear();

    let noteInfo = { title, description, date: `${month} ${day}, ${year}` };
    //Eğer düzenleme moddaysak notu güncelle değilse yeni note ekle
    if (isUpdate) {
      // Güncelleme modundaysak ilgili elemanın içeriğini güncelle
      notes[updateId] = noteInfo;
      // Güncelleme modunu kapat
      isUpdate = false;
    } else {
      notes.push(noteInfo);
    }

    localStorage.setItem("notes", JSON.stringify(notes));
    // Popup ı eski haline çevirdik
    popupBoxContainer.classList.remove("show");
    popupBox.classList.remove("show");
    popupTitle.textContent = "Not Ekle";
    button.textContent = "Not Ekle";

    document.querySelector("body").style.overflow = "auto";
  }
  // Inputların içeriğini temizledik
  titleInput.value = "";
  descriptionInput.value = "";
  // Not eklendikten sonra notları render et
  showNotes();
});

// Note Silme Özelliğini sağlayan fonksiyon
function deleteNote(noteId) {
  if (confirm("Silmek istediğinizden eminmisiniz ?")) {
    // Belirlenen note u note dizisinden kaldır
    notes.splice(noteId, 1);
    // LocalStorage ı güncelle
    localStorage.setItem("notes", JSON.stringify(notes));
    // Notları render et
    showNotes();
  }
}

// Note güncellemesi yapan fonksiyon

function updateNote(noteId, title, description) {
  isUpdate = true;
  updateId = noteId;
  // Popup ı görünür kıldık
  popupBoxContainer.classList.add("show");
  popupBox.classList.add("show");
  popupTitle.textContent = "Notu Güncelle";
  button.textContent = "Notu Güncelle";
  form.elements[0].value = title;
  form.elements[1].value = description;
}

// Menü içeriğini gösteren fonksiyon
function showMenu(elem) {
  // parentElement bir elemanın kapsam elemanına erişmek için kullanılır.Burada tıklanan iconun kapsayıcısına bir class eklemememiz gerektiğinden parentElement ile bu elemanın kapsayıcısına eriştik.
  // Kapsam elemanına show classı ekledik
  elem.parentElement.classList.add("show");
  // Menu harici bir yere tıklanırsa show classını kaldır
  document.addEventListener("click", (e) => {
    // Tıklanılan elemana i etiketi değilse yada kapsam elemana eşit değilse show classını kaldır.Buradaki 'I' kullanımın sebebi tagName property sinin büyük harf  olarak kabul edilmesidir.
    if (e.target.tagName != "I" || e.target != elem) {
      elem.parentElement.classList.remove("show");
    }
  });
}

// ! Ekrana notları render eden fonksiyon

function showNotes() {
  // Eğer notlar yoksa fonksiyonu durdur
  if (!notes) return;

  // Önceden eklenen notları kaldır
  document.querySelectorAll(".note").forEach((li) => li.remove());

  // Not dizisindeki her eleman için ekrana bir not kartı bas
  notes.forEach((note, id) => {
    let liTag = `   <li class="note">
        <div class="details">
          <p>${note.title} </p>
          <span>${note.description} </span>
        </div>

        <div class="bottom-content">
          <span>${note.date} </span>
          <div class="settings">
            <i class="bx bx-dots-horizontal-rounded" ></i>
                <ul class="menu">
            <li onclick='updateNote(${id}, "${note.title}", "${note.description}")'><i class="bx bx-edit"></i> Düzenle</li>
            <li onclick='deleteNote(${id})'><i class="bx bx-trash"></i> Sil</li>
          </ul>
          </div>
        </div>
      </li>`;
    // insertAdjacentHTML metodu belirli bir öğeyi Html kısmına sıratlı şekilde eklemek için kullanılır.Bu metod hangi yapının ardında bir  eleman eklenecekse bunu yazmamızı sonrasında ise eklenecek elemanın içeriğini belirltmemizi ister.
    addBox.insertAdjacentHTML("afterend", liTag);
  });
}

// Silme ve düzenleme işlemi yapılabilmesi için bazı düzenlemeler
// ! Wrappper Html'den erişilen kapsam elemandır
wrapper.addEventListener("click", (e) => {
  // Eğer menu üç nokta iconuna tıklanırsa showMenu fonk. çalıştır
  if (e.target.classList.contains("bx-dots-horizontal-rounded")) {
    showMenu(e.target);
  }
  // Eğer sil iconuna tıklandıysa deleteNote fonk. çalıştır
  else if (e.target.classList.contains("bx-trash")) {
    // dataset bir elemana özellik atamaya yarar.Bu örnekte id atadık
    const noteId = parseInt(e.target.closest(".note").dataset.id, 10);
    deleteNote(noteId);
  } else if (e.target.classList.contains("bx-edit")) {
    // Düzenleme işlemi yapılacak kapsam elemana eriş
    const noteElement = e.target.closest(".note");
    const noteId = parseInt(noteElement.dataset.id, 10);
    // title ve description değerlerine eriş
    const title = noteElement.querySelector(".details p").innerText;
    const description = noteElement.querySelector(".details span").innerText;

    updateNote(noteId, title, description);
  }
});

document.addEventListener("DOMContentLoaded", () => showNotes());


