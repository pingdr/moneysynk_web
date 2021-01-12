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
    });
  }

}
