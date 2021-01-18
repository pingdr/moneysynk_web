import { Component } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'My-App';


  ngOnInit(): void {
    $(document).ready(function () {
      $(document).on("keyup", ".string_trim", function () {
        var str = $(this).val();
        var s = str.replace(/\s+/, "");
        $('.string_trim').val($.trim(s));
      });
      $(document).on("keyup", ".string_trim1", function () {
        var str = $(this).val();
        var s = str.replace(/\s+/, "");
        $('.string_trim1').val($.trim(s));
      });
      $(document).on("keyup", ".string_trim2", function () {
        var str = $(this).val();
        var s = str.replace(/\s+/, "");
        $('.string_trim2').val($.trim(s));
      });
      $(document).on("keyup", ".string_trim3", function () {
        var str = $(this).val();
        var s = str.replace(/\s+/, "");
        $('.string_trim3').val($.trim(s));
      });
      $(document).on("keyup", ".string_trim4", function () {
        var str = $(this).val();
        var s = str.replace(/\s+/, "");
        $('.string_trim4').val($.trim(s));
      });
      $(document).on("keyup", ".string_trim5", function () {
        var str = $(this).val();
        var s = str.replace(/\s+/, "");
        $('.string_trim5').val($.trim(s));
      });
      $(document).on("keyup", ".string_trim6", function () {
        var str = $(this).val();
        var s = str.replace(/\s+/, "");
        $('.string_trim6').val($.trim(s));
      });
      $(document).on("keyup", ".string_trim7", function () {
        var str = $(this).val();
        var s = str.replace(/\s+/, "");
        $('.string_trim7').val($.trim(s));
      });

      $(document).on("keyup", ".string_trim8", function () {
        var str = $(this).val();
        var s = str.replace(/\s+/, "");
        $('.string_trim8').val($.trim(s));
      });


      $(document).on('keypress', '#inputTextBox', function (event) {
        var regex = new RegExp("^[a-zA-Z ]+$");
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if (!regex.test(key)) {
            event.preventDefault();
            return false;
        }
    });

      
    });
  }

}
