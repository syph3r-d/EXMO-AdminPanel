/*const register_btn = document.getElementById("register-btn");

register_btn.addEventListener("click", async () => {
  try {
    const response = await fetch("/register");
    const html = await response.text();
    document.body.innerHTML = html;
    history.pushState({}, null, "/register");
  } catch (error) {
    console.error(error);
  }
});*/

const loginForm = document.getElementById("log-user");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: usernameInput.value,
          password: passwordInput.value
        })
      });
      const data = await response.json();
      console.log(data.access_token);
      // do something with the JWT
    } catch (error) {
      console.error(error);
    }
  });

  const registerButton = document.getElementById("register-btn");
  registerButton.addEventListener("click", () => {
    window.location.href = "/register";
  });