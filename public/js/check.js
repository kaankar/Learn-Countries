const form = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const datalistOption = document.getElementById('countries').options;

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const enteredValue = searchInput.value;
  let matchFound = false;
  for (let i = 0; i < datalistOption.length; i++) {
    if (datalistOption[i].value === enteredValue) {
      matchFound = true;
      break;
    }
  }
  if (matchFound) {
    form.submit();
  } else {
    alert(
      'Please select a valid option from the suggestions. Countries in the suggestions should be written in the same format.',
    );
  }
});
