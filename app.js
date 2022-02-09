import { Chatroom } from "./chat.js";
import { ChatUI } from "./ui.js";

// DOM
let chatRoomArea = document.querySelector(".chat_room_text");
let msgInput = document.querySelector(`.yourMessage`);
let send = document.querySelector(".send");
let changedUsername = document.querySelector("#changedUsername");
let usernameInput = document.querySelector(`.username_input input[type="text"]`);
let update = document.querySelector(".update");
let headerAll = document.querySelector("section ul");
let colorB = document.querySelector("#colorB");
let firstDate = document.querySelector(".firstDate");
let secondDate = document.querySelector(".secondDate");
let getDates = document.querySelector(".getDates");
let allLis = document.querySelectorAll("li");

// Sounds and sound control
let addingSound = new Audio("Sounds/tick.mp3")
addingSound.volume = 0.5;
let removeSound = new Audio("Sounds/removing2.mp3")
removeSound.volume = 0.5;
let denied = new Audio("Sounds/denied1.mp3");
denied.volume = 0.5;

// Objekti klasa / Instance klasa
let username = "Anonymous";
let room = "general";
let chatroom = new Chatroom(room, username);
let chat = new ChatUI(chatRoomArea);
let boxShadow = `0px 0px 15px 4px black`;

// Demonstracija za Local Storage
localStorage.setItem("x", 7);

// Uzimanje vrednosti iz Local Storage
// Za username:
export let u = localStorage.localStorageUsername;
if (u) {
    chatroom.username = u;
}
// Za sobu:
let r = localStorage.lastRoom;
if (r) {
    chatroom.room = r;
}
// Za Box Shadow:
let b = localStorage.boxShadow;
if (b) {
    chatRoomArea.style.boxShadow = b;
}

// Ispis dokumenata iz db na stranicu
chatroom.getChats((d) => {
    chat.templateDiv(d);
});

// Mala funkcijica za uredjivanje texta-bordera-inputa.
let inputInfo = (variable, text, border) => {
    variable.style.border = border;
    variable.placeholder = text;
};

// Dugme send za ispis nove poruke.
send.addEventListener("click", (r) => {
    r.preventDefault();
    if (msgInput.value.trim() !== "") {
        inputInfo(msgInput, "Your message", "2px solid black");
        chatroom.addChat(msgInput.value).then(() => {
            msgInput.value = "";
            addingSound.play();
        }).catch(err => {
            console.log("ERROR:", err);
        });
    } else {
        inputInfo(msgInput, "Enter a valid message", "2px solid red");
        msgInput.value = "";
        denied.play();
    }
    stb(chatRoomArea);
});

// Small function for username popup
let usernameAlertPopup = (variable, visibility, opacity) => {
    variable.style.visibility = visibility;
    variable.style.opacity = opacity;
}

// Dugme update za update-ovanje novog username-a
update.addEventListener("click", (e) => {
    e.preventDefault();
    let userX = usernameInput.value;
    chatroom.updateUsername(userX);
    if (userX.length >= 2 && userX.length <= 10) {
        localStorage.setItem("localStorageUsername", usernameInput.value);
        let SP = `<span style="color:rgb(0, 38, 252)">${usernameInput.value}</span>`;
        changedUsername.innerHTML = `Username changed to:<br>${SP}`;
        usernameAlertPopup(changedUsername, "visible", "1");
        setTimeout(() => {
            usernameInput.value = "";
            usernameAlertPopup(changedUsername, "hidden", "0");
            setTimeout(() => {
                changedUsername.innerText = "";
                location.reload();
            }, 700)
        }, 3000)
    }
});

// Klik na dugme da promeni sobu
headerAll.addEventListener("click", (e) => {
    let dugme = e.target;
    localStorage.setItem("lastRoom", dugme.innerText.slice(1));
    if (dugme.tagName === "A") {
        // 0:
        allLis.forEach(el => {
            el.style.borderColor = "#ec05d900";
            el.style.transform = "scale(1)";
        })
        dugme.parentElement.style.borderColor = "rgb(70, 70, 70)";
        dugme.parentElement.style.transform = "scale(1.15)";
        // 1: Postavi Room value;
        chatroom.updateRoom(dugme.innerText.slice(1));
        // 2: Brisi HTML.
        chat.delete();
        // 3: Prikaz HTML:
        chatroom.getChats((d) => {
            chat.templateDiv(d);
        });
        // 4: Pokazivanje poslednjeg chata funkcija
        stb(chatRoomArea);
    }
})

// Brisanje chat-a
chatRoomArea.addEventListener("click", (del) => {
    let delT = del.target;
    if (delT.tagName === "IMG") {
        if (chatroom.username === delT.parentElement.childNodes[1].childNodes[0].innerText.slice(0, - 2)) {
            if (confirm("Delete message permanently?")) {
                chatroom.deleteMsg(del.target.parentElement.id);
                del.target.parentElement.remove();
                removeSound.play();
            }
        } else {
            del.target.parentElement.remove();
        }
    }
})

// Promwna box shadowa Main chat podrucju
colorB.addEventListener("change", (no) => {
    no.preventDefault();
    setTimeout(() => {
        chatRoomArea.style.boxShadow = `0px 0px 15px 4px ${colorB.value}`;
        localStorage.setItem("boxShadow", `0px 0px 15px 4px ${colorB.value}`)
    }, 500)
})

// For DATE filters
getDates.addEventListener("click", (gd) => {
    gd.preventDefault();
    let second = new Date(secondDate.value);
    let secondSeconds = second.getTime() / 1000;
    let first = new Date(firstDate.value);
    let firstSeconds = first.getTime() / 1000;
    if (firstSeconds && secondSeconds) {
        chat.delete();
        chatroom.getChats((d) => {
            let time = d.data().created_at;
            if (time.seconds > firstSeconds && time.seconds < secondSeconds) {
                chat.templateDiv(d);
            }
        });
        stb(chatRoomArea);
    }
});

// Funkcija za pomeranje chate an dole
let stb = (a) => {
    setTimeout(() => {
        a.scrollTop = a.scrollHeight;
    }, 200)
};

// Izvrsena funkcija za 100ms zbog delaya brosera
setTimeout(() => {
    stb(chatRoomArea);
}, 100)

for (let i = 0; i < 15; i++) {
    chatroom.addChat(i);
}
