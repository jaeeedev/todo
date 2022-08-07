const btn = document.querySelector("#btn");
const text = document.querySelector("#text");
let checklist = [];
const addForm = document.querySelector(".add");

addForm.addEventListener("submit", addList);

function addList(e) {
  const date = new Date();

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  e.preventDefault();
  if (text.value.trim().length === 0) {
    alert("공백을 제외한 텍스트를 입력 해 주세요.");
    return;
  } else {
    checklist.push({
      text: text.value,
      checked: false,
      date: `${month}월 ${day}일 , ${year}   <i class="fa-solid fa-minus"></i>   ${hours} : ${minutes}`,
      mod: false,
    });
    text.value = "";
    text.focus();
  }
  localStorage.setItem("check", JSON.stringify(checklist));
  showList();
}

function showList() {
  const writearea = document.querySelector("#writearea");
  let list = checklist
    .map(
      (task, i) =>
        `<li class="todo_li">
        <img class="checkbox" width="20px" data-index=${i} 
        preserveAspectRatio="none" 
        src=${task.checked ? "square-check-regular.svg" : "square-regular.svg"}>
        <div>
        <p class="todo_text" contenteditable=${
          task.mod ? "true" : "false"
        } spellcheck=false>
        ${task.text}
        </p>
        <p class="date_info">${task.date}</p>
        </div>
        <div class="more_box">
        <button class="mod_cancel" show=${
          task.mod ? "true" : "false"
        }><i class="fa-solid fa-xmark"></i></button>
        <button class="mod_confirm" show=${
          task.mod ? "true" : "false"
        }><i class="fa-solid fa-check"></i></button>
        <button class="more" show=${
          !task.mod ? "true" : "false"
        }><i class="fa-solid fa-ellipsis-vertical"></i></button>
        <div class="menus">
        <span class="mod">수정</span>
        <span class="del" data-index=${i}>삭제</span>
        </div>
        </div></li>`
    )
    .join("");
  writearea.innerHTML = `<ul>${list}</ul>`;

  const todoLists = document.querySelectorAll(".todo_li");

  todoLists.forEach((list, i) =>
    list.addEventListener("click", (e) => {
      const delBtn = list.querySelector(".del");
      const modBtn = list.querySelector(".mod");
      const confirm = list.querySelector(".mod_confirm");
      const cancel = list.querySelector(".mod_cancel");
      const text = list.querySelector(".todo_text");

      if (e.target === delBtn) {
        delX(e);
      }

      if (e.target === modBtn) {
        //한번에 한가지만 수정되도록 초기화
        checklist.map((li) => (li.mod = false));

        checklist[i].mod = true;
        showList();
      }

      if (e.target === confirm || e.target.parentElement === confirm) {
        checklist[i].mod = false;
        checklist[i].text = text.textContent;
        localStorage.setItem("check", JSON.stringify(checklist));
        showList();
      }

      if (e.target === cancel || e.target.parentElement === cancel) {
        checklist[i].mod = false;
        localStorage.setItem("check", JSON.stringify(checklist));
        showList();
      }
    })
  );

  const menuBoxes = writearea.querySelectorAll(".menus");
  const more = writearea.querySelectorAll(".more");

  more.forEach((item, i) => {
    item.addEventListener("click", () => {
      menuBoxes[i].classList.toggle("on");
    });
  });
}

const changeCheck = (e) => {
  const boxIndex = e.target.dataset.index;
  if (e.target.className !== "checkbox") {
    return;
  } else {
    checklist[boxIndex].checked = !checklist[boxIndex].checked;
    localStorage.setItem("check", JSON.stringify(checklist)); //덮어씌우기
  }
  showList();
  //재렌더링
};

function delX(e) {
  const id = e.target.getAttribute("data-index");
  checklist.splice(id, 1);
  localStorage.setItem("check", JSON.stringify(checklist)); //갱신
  showList(); //재렌더링
}

function store() {
  const localData = localStorage.getItem("check");
  if (localData != null) {
    checklist = JSON.parse(localData); //배열에 parse된 값을 넣는다.
    showList();
  }
}

document.querySelector("#writearea").addEventListener("click", changeCheck);

store();
//로컬스토리지에 저장된 값을 화면에 렌더링하는 과정으로 로컬스토리지 내 데이터를 화면에 띄우는 과정이
// 선행되지 않으면 새로고침했을때 화면이 비어버려서 이걸 하는거여
//이거없으면 추가삭제등등 가능은 하고 그려지지만 새고하면 날아감~
