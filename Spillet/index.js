$(document).ready(function() {
  // smooth scrolling to all links in navbar + footer link
  $(".navbar a, footer a[href='#hjemmeside']").on("click", function(event) {
    // Make sure this.hash has a value before overriding default behavior
    if (this.hash !== "") {
      // Prevent default anchor click behavior
      event.preventDefault();

      // Store hash
      var hash = this.hash;

      // Using jQuery's animate() method to add smooth page scroll
      // The optional number (900) specifies the number of milliseconds it takes to scroll to the specified area
      $("html, body").animate(
        {
          scrollTop: $(hash).offset().top
        },
        900,
        function() {
          // Add hash (#) to URL when done scrolling (default click behavior)
          window.location.hash = hash;
        }
      );
    } // End if
  });
});

// spørreskjema
var z1uuc3y213293ic;
(function(d, t) {
  var s = d.createElement(t),
    options = {
      userName: "teamtjuetre",
      formHash: "z1uuc3y213293ic",
      autoResize: true,
      height: "731",
      async: true,
      host: "wufoo.com",
      header: "show",
      ssl: true
    };
  s.src =
    ("https:" == d.location.protocol ? "https://" : "http://") +
    "www.wufoo.com/scripts/embed/form.js";
  s.onload = s.onreadystatechange = function() {
    var rs = this.readyState;
    if (rs) if (rs != "complete") if (rs != "loaded") return;
    try {
      z1uuc3y213293ic = new WufooForm();
      z1uuc3y213293ic.initialize(options);
      z1uuc3y213293ic.display();
    } catch (e) {}
  };
  var scr = d.getElementsByTagName(t)[0],
    par = scr.parentNode;
  par.insertBefore(s, scr);
})(document, "script");
