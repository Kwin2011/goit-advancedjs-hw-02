import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";


export function handleForm() {
  document.querySelector(".form").addEventListener("submit", (event) => {
    event.preventDefault();
  
    const form = event.target;
    const delay = parseInt(form.delay.value, 10);
    const state = form.state.value;
  
    new Promise((resolve, reject) => {
      setTimeout(() => {
        if (state === "fulfilled") {
          resolve(delay);
        } else {
          reject(delay);
        }
      }, delay);
    })
      .then((delay) => {
        iziToast.success({
          title: "✅ Success",
          message: `Fulfilled promise in ${delay}ms`,
          position: "topRight",
        });
      })
      .catch((delay) => {
        iziToast.error({
          title: "❌ Error",
          message: `Rejected promise in ${delay}ms`,
          position: "topRight",
        });
      });
  
    form.reset();
  });
}
