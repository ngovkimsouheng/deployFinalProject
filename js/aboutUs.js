"user script"
    function handleSubmit(event) {
      event.preventDefault();
      const name = event.target.name.value.trim();
      const message = event.target.message.value.trim();
      const formMsg = document.getElementById('form-msg');

      if(!name || !message) {
        formMsg.textContent = 'សូមបំពេញទិន្នន័យគ្រប់ចំណុច។';
        formMsg.classList.remove('text-green-600');
        formMsg.classList.add('text-red-600');
        return false;
      }
      formMsg.textContent = 'សារបស់អ្នកត្រូវបានបញ្ជូនដោយជោគជ័យ។ អរគុណ!'; 
      formMsg.classList.remove('text-red-600');
      formMsg.classList.add('text-green-600');
      event.target.reset();
      return true;
    }