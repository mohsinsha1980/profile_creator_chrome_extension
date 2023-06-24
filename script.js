async function initialize() {
  const profileForm = document.getElementById("profileForm");
  const profileView = document.getElementById("v-profile");
  const btnPreFill = document.getElementById("btnPrefill");
  profileForm.style.display = "none";
  profileView.style.display = "none";

  const { profile } = await getProfileData("profile");

  if (profile) {
    profileForm.style.display = "none";
    profileView.style.display = "block";
    mapProfileValues(profile);
    btnPreFill.style.display = "inline-block";
  } else {
    profileForm.style.display = "block";
    profileView.style.display = "none";
    btnPreFill.style.display = "none";
  }

  profileForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const resume = document.getElementById("resume").files[0];
    const resumeStr = await toBase64(resume);
    const profileData = { firstName, lastName, email, resume: resumeStr };
    try {
      const isSuccess = await setProfileData(profileData);
      if (isSuccess) {
        alert("Profile has been saved successfully!");
        const { profile } = await getProfileData("profile");
        mapProfileValues(profile);
        profileForm.style.display = "none";
        profileView.style.display = "block";
        btnPreFill.style.display = "inline-block";
      }
    } catch (e) {
      alert("ERROR", e.message);
      console.log("ERROR", e);
    }
  });

  btnPreFill.addEventListener("click", async (e) => {
    e.preventDefault();
    const { profile } = await getProfileData("profile");
    if (profile && Object.keys(profile).length > 0) {
      try {
        
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          // console.log('tabs[0].id', tabs[0].id);
          // var profileStr = JSON.stringify(profile);
          // function fillForm(profileStr) {
          //   var profile = JSON.parse(profileStr);
          //   fillField(document.querySelector('input[name="firstName"]'), profile.firstName);
          //   fillField(document.querySelector('input[name="lastName"]'), profile.lastName);
          //   fillField(document.querySelector('input[name="email"]'), profile.email);
          //   fillField(document.querySelector('input[name="phone"]'), '9999999999');
          //   fillField(document.querySelector('input[name="streetAddress"]'), '111 Main St.');
          //   fillField(document.querySelector('input[name="address"]'), '111 Main St.');
          //   fillField(document.querySelector('input[name="city"]'), 'Pune');
          // }
          
          // function fillField(selector, value) {
          //   var field = selector;
          //   if (field) {
          //     field.value = value;
          //   }
          // }
          chrome.scripting.executeScript({
            target: {tabId : tabs[0].id, allFrames: true},
            files : ["injector.js"],
            // func: fillForm,
            // args: [profileStr],
          })
        })
      } catch (e) {
        console.error(e.message);
      }
    }
  });

  function getProfileData(key) {
    return new Promise((resolve, reject) => {
      return chrome.storage.local.get(key, (result) => {
        return chrome.runtime.lastError
          ? reject(Error(chrome.runtime.lastError.message))
          : resolve(result);
      });
    });
  }
  function setProfileData(profile) {
    return new Promise((resolve, reject) => {
      const key = "profile";
      return chrome.storage.local.set({ [key]: profile }, () => {
        return chrome.runtime.lastError
          ? reject(Error(chrome.runtime.lastError.message))
          : resolve(true);
      });
    });
  }

  function toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });
  }

  function mapProfileValues(profile) {
    const fName = document.getElementById("v-firstName");
    const lName = document.getElementById("v-lastName");
    const email = document.getElementById("v-email");
    const resume = document.getElementById("v-resume");
    fName.innerText = profile.firstName;
    lName.innerText = profile.lastName;
    email.innerText = profile.email;
    resume.href = profile.resume;
    resume.download = "resume.pdf";
  }

  
}
initialize();