'use strict';

angular.module('oide.nbterm')

.controller('TerminalCtrl', ['$window','$log', function($window,$log) {
  var self = this;

  function make_terminal(element, size, ws_url) {
    var ws = new WebSocket(ws_url);
    var term = new Terminal({
      cols: size.cols,
      rows: size.rows,
      screenKeys: true,
      useStyle: true
    });
    ws.onopen = function(event) {
      ws.send(JSON.stringify(["set_size", size.rows, size.cols,
                                  window.innerHeight, window.innerWidth]));
      term.on('data', function(data) {
        ws.send(JSON.stringify(['stdin', data]));
      });

      term.on('title', function(title) {
        document.title = title;
      });

      term.open(element);

      ws.onmessage = function(event) {
        var json_msg = JSON.parse(event.data);
        switch(json_msg[0]) {
          case "stdout":
            term.write(json_msg[1]);
            break;
          case "disconnect":
            term.write("\r\n\r\n[Finished... Terminado]\r\n");
            break;
        }
      };
    };
    return {socket: ws, term: term};
  }

  var protocol = (window.location.protocol.indexOf("https") === 0) ? "wss" : "ws";
  var ws_url = protocol+"://"+window.location.host+ "/nbterm/a/term";

  function calculate_size() {
    var h = document.documentElement.clientHeight;
    var w = document.documentElement.clientWidth;
    var rows = Math.max(2, Math.floor((h-164)/15)-1);
    var cols = Math.max(3, Math.floor((w-80)/7)-1);
    return {rows: rows, cols: cols};
  }
  var size = calculate_size();
  var terminal = make_terminal(document.getElementById("terminal-pane"), size, ws_url);
  $window.onbeforeunload = function (term) { term.destroy() };
}]);
