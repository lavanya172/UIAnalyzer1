if (typeof jQuery !== "undefined" && typeof saveAs !== "undefined") {
    (function($) {
        $.fn.wordExport = function(fileName) {
            fileName = typeof fileName !== 'undefined' ? fileName : "jQuery-Word-Export";
            var static = {
                mhtml: {
                    top: "Mime-Version: 1.0\nContent-Base: " + location.href + "\nContent-Type: Multipart/related; boundary=\"NEXT.ITEM-BOUNDARY\";type=\"text/html\"\n\n--NEXT.ITEM-BOUNDARY\nContent-Type: text/html; charset=\"utf-8\"\nContent-Location: " + location.href + "\n\n<!DOCTYPE html>\n<html>\n_html_</html>",
                    head: "<head>\n<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">\n<style>\n_styles_\n</style>\n</head>\n",
                    body: "<body>_body_</body>"
                }
            };
            var options = {
                maxWidth: 624
            };
            // Clone selected element before manipulating it
            var markup = $(this).clone();

            // Remove hidden elements from the output
            markup.each(function() {
                var self = $(this);
                if (self.is(':hidden')){
                    self.remove();
                }
            });
            // var a=markup.html();
            // var b= a[3].children;
            // for(var c=0;c<b.length;c++){
            //     if(b[c].className=="dummy-t"){
            //         /*var b=innerSelf.children();
            //         console.log(index,this);
            //         console.log(index,b.length);*/
            //         b[c].setAttribute("background-color","yellow");
            //     }
            // }
            /*a.each(
                function(index) {
                    var innerSelf=$(this);
                    if(a[3].className=="dummy-t"){
                        var b=innerSelf.children();
                        console.log(index,this);
                        console.log(index,b.length);
                        a[3].css("background-color", "yellow");
                    }
                }
            );*/
            //console.log("aaaaaaa-------"+a);
            // Embed all images using Data URLs
            var images = Array();
            var img = markup.find('img');
            img.removeClass("nonedisplay");
            var pdf = new jsPDF("p", "mm", "a4");

           // var pdf = new jsPDF({orientation: "p", lineHeight: 0.25});
            pdf.setLineHeightFactor(0.5);
            pdf.setFontSize(1);
            for (var i = 0; i < img.length; i++) {
                // Calculate dimensions of output image
                /*var w = Math.min(img[i].width, options.maxWidth);
                var h = img[i].height * (w / img[i].width);*/
                var pdfWidth = pdf.internal.pageSize.getWidth();
                var pdfHeight = (img[i].height * pdfWidth)/ img[i].width;
                // Create canvas for converting image to data URL
                var canvas = document.createElement("CANVAS");
                canvas.width = pdfWidth;
                canvas.height = pdfHeight;
                // Draw image to canvas
                var context = canvas.getContext('2d');
                context.drawImage(img[i], 0, 0, pdfWidth, pdfHeight);
                // Get data URL encoding of image
                var uri = canvas.toDataURL("image/png");
                $(img[i]).attr("src", img[i].src);
                img[i].width = pdfWidth*3;
                img[i].height = pdfHeight*3;
                // Save encoded image to array
                images[i] = {
                    type: uri.substring(uri.indexOf(":") + 1, uri.indexOf(";")),
                    encoding: uri.substring(uri.indexOf(";") + 1, uri.indexOf(",")),
                    location: $(img[i]).attr("src"),
                    data: uri.substring(uri.indexOf(",") + 1)
                };
            }

            // Prepare bottom of mhtml file with image data
            var mhtmlBottom = "\n";
            for (var i = 0; i < images.length; i++) {
               // mhtmlBottom += "--NEXT.ITEM-BOUNDARY\n";
               // mhtmlBottom += "Content-Location: " + images[i].location + "\n";
               // mhtmlBottom += "Content-Type: " + images[i].type + "\n";
               // mhtmlBottom += "Content-Transfer-Encoding: " + images[i].encoding + "\n\n";
                mhtmlBottom += images[i].data + "\n\n";
            }
           // mhtmlBottom += "--NEXT.ITEM-BOUNDARY--";

            //TODO: load css from included stylesheet
            var styles = "";

            // Aggregate parts of the file together
            var fileContent = static.mhtml.top.replace("_html_", static.mhtml.head.replace("_styles_", styles) + static.mhtml.body.replace("_body_", markup.html())) + mhtmlBottom;

            // Create a Blob with the file contents
          /*  var blob = new Blob([fileContent], {
                type: "application/msword;charset=utf-8"
            });*/
           // saveAs(blob, fileName + ".pdf");
           /* var printWindow = window.open('', '', 'height=400,width=800');
            printWindow.document.write(fileContent);
            printWindow.print();*/
           /* var doc = new jsPDF();
            doc.output("blob");
            doc.html(fileContent, {
                callback: function(doc) {
                    doc.save("output.pdf");
                },
                x: 10,
                y: 10
            });*/
            //doc.fromHTML($temp.html(),{});
            // saveAs(blob, fileName + ".doc");
                //Set the File URL.
           /* var oReq = new XMLHttpRequest();
// The Endpoint of your server
            var URLToPDF = "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf";

// Configure XMLHttpRequest
            oReq.open("GET", URLToPDF, true);

// Important to use the blob response type
            oReq.responseType = "blob";

// When the file request finishes
// Is up to you, the configuration for error events etc.
            oReq.onload = function() {
                // Once the file is downloaded, open a new window with the PDF
                // Remember to allow the POP-UPS in your browser
                var file = new Blob([fileContent], {
                    type: 'application/pdf'
                });

                // Generate file download directly in the browser !
                saveAs(file, "mypdffilename.pdf");
            };

            oReq.send();*/
           // window.jsPDF = window.jspdf.jsPDF;
         //   var pdf = new jsPDF();
           /* pdf.canvas.height = 72 * 11;
            pdf.canvas.width = 72 * 8.5;
*/
            //var source = window.document.getElementsByTagName("body")[0];

           /* pdf.fromHTML(markup.html(), 15, 15, {
                    'width': 100 // max width of content on PDF
                },
                function(bla){
                pdf.addPage();
                    pdf.addPage();
                pdf.save('UI-AnalyzerReport.pdf');},
                0);*/
            var opt = {
                margin:       [10, 15, 10, 15],
                filename:     `UI-AnalyzerReport.pdf`,
                image:        { type: 'png', quality: 0.98 },
                html2canvas:  { scale: 2, useCORS: true },
                jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };
            html2pdf().from(markup.html()).set(opt).save();

            /*  pdf.fromHTML(source, 15, 15);

              pdf.save('test.pdf');*/
        };
    })(jQuery);
} else {
    if (typeof jQuery === "undefined") {
        console.error("jQuery Pdf Export: missing dependency (jQuery)");
    }
    if (typeof saveAs === "undefined") {
        console.error("jQuery Pdf Export: missing dependency (jspdf.min.js)");
    }
}