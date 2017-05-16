'use strict';

// Justin pointed out I should move my projects variable out of the global namespace
// by attaching it as a methond to my Project constructor

var projects = [];

// Justin brought up let versus var and how I should change my code to use let instead.

function Project(rawDataObject) {
  for (var key in rawDataObject) {
    this[key] = rawDataObject[key];
  }
}


Project.prototype.toHtml = function() {
  // REVIEW: This method on each instance of Project allows that object to create its own HTML
  // TODO: Complete this using Handlebars!!!
  // 1. Get the template from the HTML document
  var template = $('#project-template').html();
  // 2. Use Handlebars to "compile" the HTML
  var templateRender = Handlebars.compile(template);
  // 3. Do not forget to return the HTML from this method
  return templateRender(this);
};

// projectDataSets.forEach(function(projectObject) {
//   projects.push(new Project(projectObject));
// });

projects.forEach(function(myNewProjectObject){
  $('#projects').append(myNewProjectObject.toHtml());
});

$(document).ready(function(){
  $('section').hide();
  $('#projects').show();
});

$('.nav-ul li').on('click', function(){
  $('section').hide();
  if ($(this).hasClass('nav-about')) {
    $('#about-me-page').fadeIn(350);
  } else if ($(this).hasClass('nav-home')) {
    $('#projects').fadeIn(350);
  } else if ($(this).hasClass('nav-contact')) {
    $('#contact-page').fadeIn(350);
  }
});

Project.initProjectPage = function (){
  projects.forEach(function(myNewProjectObject){
    console.log(myNewProjectObject, 'myNewProjectObject');
    $('#projects').append(myNewProjectObject.toHtml());
  });
}

Project.loadAll = function(rawData) {
  // rawData.sort(function(a,b) {
  //   return (new Date(b.publishedOn)) - (new Date(a.publishedOn));
  // });

  rawData.forEach(function(object) {
    projects.push(new Project(object));
  })
}

// This function will retrieve the data from either a local or remote source,
// and process it, then hand off control to the View.
Project.fetchAll = function() {
  if (localStorage.rawData) {
    // When rawData is already in localStorage,
    // we can load it with the .loadAll function above,
    // and then render the index page (using the proper method on the articleView object).
    Project.loadAll(JSON.parse(localStorage.rawData)); //TODO: What do we pass in to loadAll()?
    //TODO: What method do we call to render the index page?
    // articleView.initIndexPage(localStorage.rawData);

    Project.initProjectPage();

  } else {
    // TODO: When we don't already have the rawData,
    // we need to retrieve the JSON file from the server with AJAX (which jQuery method is best for this?),
    // cache it in localStorage so we can skip the server call next time,
    // then load all the data into Project.all with the .loadAll function above,
    // and then render the index page.
    $.getJSON('/projectData.json')
      .then(function(data){
        localStorage.rawData = JSON.stringify(data);
        Project.loadAll(data);
        // articleView.initIndexPage();
        Project.initProjectPage();
      },
      function(err){
        console.log(err, 'error in fetchAll else statement');
      })
  }
}
