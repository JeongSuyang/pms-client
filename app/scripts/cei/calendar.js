/**
 * Created by zkyz on 20150324....
 */
(function (jq) {
  "use strict";

  var DAY_TIME = 86400000;

  var calendar = {};
  calendar.el = $("<div class='cei-calendar'><div class='bg'></div><table><caption></caption><thead><tr><th>SUN</th><th>MON</th><th>TUE</th><th>WED</th><th>THU</th><th>FRI</th><th>SAT</th></tr></thead><tbody><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr></tbody></table></div>");
  calendar.bg = $(">.bg", calendar.el);
  calendar.table = $(">table", calendar.el);

  var isMobile = function () {
      return !!navigator.userAgent.match(/Android|iPhone|iPad|iPod/i);
    },
    /**
     * 입력 값을 날짜로 분리합니다.
     * @param v
     * @returns {{year: *, month: *, date: *}}
     */
    generateDate = function (v) {
      var year, month, date;
      if (v) {
        var dateStr = (v).replace(/[^0-9]/g, "");
        year = parseInt(dateStr.substring(0, 4));
        month = parseInt(dateStr.substring(4, 6));
        date = parseInt(dateStr.substring(6, 8));
      }
      else {
        var nd = new Date();
        year = nd.getFullYear();
        month = nd.getMonth() + 1;
        date = nd.getDate();
      }

      return {
        year: year,
        month: month,
        date: date
      };
    },
    /**
     * 연도와 월을 입력합니다.
     */
    writeYearMonth = function () {
      $("caption", calendar.el).html(
        (arguments[0] || calendar.table.data("src").year)
        + ". "
        + (arguments[1] || calendar.table.data("src").month));
    },
    /**
     * 날짜를 입력합니다.
     * @param td {element} 날짜를 입력할 대상
     * @param date {Date} 입력할 날짜
     */
    writeDate = function (td, date) {
      $(td).data("date", date)
        .html(date.getDate());
    },
    /**
     * 현재 월에 해당되는 날짜들에 대해서 하이라이트 합니다.
     */
    coloring = function () {
      var thisMonth = calendar.table.data("src").month - 1;

      calendar.table.find("td").each(function (i, td) {
        var $td = $(td);

        if ($td.data("date").getMonth() !== thisMonth) $td.addClass("outmonth");
        else $td.removeClass("outmonth");
      });
    },
    draw = function () {
      writeYearMonth();

      var src = calendar.table.data("src"),
        date = new Date(src.year, src.month - 1, 1);

      //달력의 첫번째에 들어오는 일자 구하기
      date.setTime(date.getTime() - ((date.getDay() + 7) * DAY_TIME));

      //달력의 시작일자 저장
      calendar.table.data("startTime", date.getTime());

      //달력에 날짜 채우기
      $("td", calendar.table).each(function (i, td) {
        writeDate(td, new Date(date.getTime() + DAY_TIME * i));
      });

      coloring();

      //달력의 끝일자 저장
      calendar.table.data("endTime", date.getTime() + DAY_TIME * 48);

      calendar.el.show();
    },
    moveWeek = function (direction) {
      var tbody = calendar.table.find("tbody"),
        frame = tbody.find("tr:eq(0)").clone(true),
        time = 0;

      if (direction === "down") {
        time = calendar.table.data("startTime") - DAY_TIME * 7;

        calendar.table.data("startTime", time);
        calendar.table.data("endTime", calendar.table.data("endTime") - DAY_TIME * 7);

        tbody.find("tr:first-child").before(frame);
        tbody.find("tr:last-child").remove();
      }
      else {
        time = calendar.table.data("endTime") + DAY_TIME;

        calendar.table.data("startTime", calendar.table.data("startTime") + DAY_TIME * 7);
        calendar.table.data("endTime", calendar.table.data("endTime") + DAY_TIME * 7);

        tbody.append(frame)
          .find("tr:first-child").remove();
      }

      frame.find("td").each(function (i, td) {
        var date = new Date(time + (DAY_TIME * i));
        writeDate(td, date);
      });

      //달력의 가운데(총 49개의 날짜 중 24번째 날짜)를 이용해서 현재 월을 확인
      var middleDateOfMonth = new Date(calendar.table.data("startTime") + DAY_TIME * 24),
        thisMonth = middleDateOfMonth.getMonth() + 1;

      //저장된 월와 계산된 현재 월이 다를 경우,
      //표시 연월을 바꿈
      if (calendar.table.data("src").month !== thisMonth) {
        calendar.table.data("src").month = thisMonth;
        writeYearMonth(middleDateOfMonth.getFullYear(), thisMonth);
      }

      coloring();
    },
    init = function (input) {
      calendar.table.data("input", input);
      calendar.table.data("clientY", null);
      calendar.table.data("startTime", null);
      calendar.table.data("endTime", null);
      calendar.table.data("src", generateDate(input.value));

      if (isMobile()) {
        input.blur();
      }
      else {
        var $input = $(input),
          pos = $input.offset();

        calendar.el.css({
          left: pos.left,
          marginTop: 0,
          top: pos.top + $input.height(),
          width: 224
        });
        calendar.table.css("width", "100%");

        calendar.bg.hide();
      }

      draw();
    };

  //jQuery 에서 활용되도록 등록합니다.
  if (!jq.hasOwnProperty("cei")) {
    jq.cei = {};
  }
  jq.cei.calendar = function (targets) {
    //달력 기본 구조를 구성합니다.
    if ($(".cei-calendar").size() === 0) {
      document.body.appendChild(calendar.el[0]);

      calendar.bg.on("click", function () {
        calendar.el.hide("fast");
      });

      if (isMobile()) {
        calendar.table.on("touchstart", function (e) {
          $(this).data("clientY", e.originalEvent.changedTouches[0].clientY);
        }).on("touchmove", function (e) {
          var $this = $(this),
            clientY = $this.data("clientY"),
            cy = e.originalEvent.changedTouches[0].clientY;

          if (clientY + 10 < cy || clientY - 10 > cy) {
            moveWeek(clientY < cy ? "down" : "up");
            $(this).data("clientY", cy);
          }

          e.preventDefault();
          e.stopPropagation();
        });
      }
      else {
        calendar.table
          .on("mousewheel", function (e) {
            var clientY = $(this).data("clientY");

            if (clientY > 10) {
              $(this).data("clientY", 0);
              moveWeek(e.originalEvent.wheelDelta > 0 ? "down" : "up");
            }

            $(this).data("clientY", ++clientY);
            console.log(clientY)
          });
      }
    }

    //따로 지정된 내용이 input태그의 type속성이 datetime 인 것들에 자동으로 달력 설정을 넣습니다.
    if (!targets) {
      targets = $("input[type=datetime]");
    }
    else if (typeof targets === "string" || (targets.nodeType === 1)) {
      targets = $(targets);
    }

    targets.filter(":not([data-cei])").each(function (i, input) {
      $(input).attr("data-cei", true).focus(function () {
        init(this);
      }).blur(function () {
        calendar.el.hide();
      });
    });
  };
})
(jQuery);
