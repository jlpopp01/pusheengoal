/* This is the JS for the modal. */

var modal = document.getElementById('contactMe');
var button = document.getElementById("contactMeB");
var span = document.getElementsByClassName("close")[0];



button.onclick = function() {
    modal.style.display = "block";
}

span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

//JS Ideas - Another form pops up that allows you to see submitted projects




function getFiles() {
    return $.ajax('/api/file')
      .then(res => {
        console.log("Results from getFiles()", res);
        return res;
      })
      .fail(err => {
        console.error("Error in getFiles()", err);
        throw err;
      });
  }
  
  function refreshFileList() {
    const template = $('#list-template').html();
    const compiledTemplate = Handlebars.compile(template);
  
    getFiles()
      .then(files => {
  
        window.fileList = files;
  
        const data = {files: files};
        const html = compiledTemplate(data);
        $('#list-container').html(html);
      })
  }
  
  function handleAddFileClick() {
    console.log("Baby steps...");
    setFormData({});
    toggleAddFileFormVisibility();
  }
  
  function toggleAddFileFormVisibility() {
    $('#form-container').toggleClass('hidden');
  }
  
  function submitFileForm() {
    console.log("You clicked 'submit'. Congratulations.");
  
    const fileData = {
      email: $('#file-title').val(),
      description: $('#file-description').val(),
      _id: $('#file-id').val(),
    };
  
    let method, url;
    if (fileData._id) {
      method = 'PUT';
      url = '/api/file/' + fileData._id;
    } else {
      method = 'POST';
      url = '/api/file';
    }
  
    $.ajax({
      type: method,
      url: url,
      data: JSON.stringify(fileData),
      dataType: 'json',
      contentType : 'application/json',
    })
      .done(function(response) {
        console.log("We have posted the data");
        refreshFileList();
        toggleAddFileFormVisibility();
      })
      .fail(function(error) {
        console.log("Failures at posting, we are", error);
      })
  
    console.log("Your file data", fileData);
  }
  
  function cancelFileForm() {
    toggleAddFileFormVisibility();
  }
  
  function handleEditFileClick(id) {
    const file = window.fileList.find(file => file._id === id);
    if (file) {
      setFormData(file);
      toggleAddFileFormVisibility();
    }
  }
  
  
  function setFormData(data) {
    data = data || {};
  
    const file = {
      email: data.email || '',
      description: data.description || '',
      _id: data._id || '',
    };
  
    $('#file-title').val(file.title);
    $('#file-description').val(file.description);
    $('#file-id').val(file._id);
  }
  
  function handleDeleteFileClick(id) {
    if (confirm("Are you sure?")) {
      deleteFile(id);
    }
  }
  
  function deleteFile(id) {
    $.ajax({
      type: 'DELETE',
      url: '/api/file/' + id,
      dataType: 'json',
      contentType : 'application/json',
    })
      .done(function(response) {
        console.log("Dave are you sure file", id, "is ready to be deleted?");
        refreshFileList();
      })
      .fail(function(error) {
        console.log("there was a problem Dave", error);
      })
  }
  
  
  refreshFileList();