import { u } from "./app.js";

export class ChatUI {
    constructor(e) {
        this.element = e;
    }
    set element(e) {
        this._element = e;
    }
    get element() {
        return this._element;
    }
    getTime(date) {
        let todayDate = new Date();
        //
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let hour = date.getHours();
        let minutes = date.getMinutes();
        //
        day = String(day).padStart(2, "0");
        month = String(month).padStart(2, "0");
        hour = String(hour).padStart(2, "0");
        minutes = String(minutes).padStart(2, "0");
        //
        if (todayDate.toLocaleDateString() === date.toLocaleDateString()) {
            return `${hour}:${minutes}`
        } else {
            return `${day}.${month}.${year} - ${hour}:${minutes}`
        }
    }
    templateDiv(doc) {
        let id = doc.id
        let data = doc.data();
        let time = data.created_at.toDate();
        let newDiv = document.createElement("div");
        let newP = document.createElement("p");
        let newSpan = document.createElement("span");
        newSpan.innerText = `${data.username}: `;
        newSpan.classList.add("spanBubble");
        newP.appendChild(newSpan);
        newP.innerHTML += ` ${data.message}`;
        let hr = document.createElement("hr");
        let newP2 = document.createElement("p");
        newP2.innerText = `${this.getTime(time)}`;
        newP2.style.color = "gray";
        let newImg = document.createElement("img");
        newImg.src = `Images/bin.png`
        newImg.classList.add("binImg");
        newDiv.appendChild(newImg)
        newDiv.appendChild(newP);
        newDiv.appendChild(hr);
        newDiv.appendChild(newP2);
        newDiv.id = id;
        this.element.appendChild(newDiv);
        if (u === data.username) {
            newDiv.classList.add("textBubbleAway");
        } else {
            newDiv.classList.add("textBubble");
        }
    }
    delete() {
        let pic = `<img id="snowman" src="Images/snowman1.png" alt="">`
        this.element.innerHTML = pic;
    }
}