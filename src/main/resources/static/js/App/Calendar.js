var appointment = '';
(function(global, factory) {
  if (typeof define === 'function' && define.amd) {
    define('/App/Calendar', ['exports', 'Site', 'Config'], factory);
  } else if (typeof exports !== 'undefined') {
    factory(exports, require('Site'), require('Config'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.Site, global.Config);
    global.AppCalendar = mod.exports;
  }
})(this, function(_exports, _Site2, _Config) {
  'use strict';

  Object.defineProperty(_exports, '__esModule', {
    value: true
  });
  _exports.run = run;
  _exports.getInstance = getInstance;
  _exports.AppCalendar = _exports.default = void 0;
  _Site2 = babelHelpers.interopRequireDefault(_Site2);

  var AppCalendar =
    /*#__PURE__*/
    (function(_Site) {
      babelHelpers.inherits(AppCalendar, _Site);

      function AppCalendar() {
        babelHelpers.classCallCheck(this, AppCalendar);
        return babelHelpers.possibleConstructorReturn(
          this,
          babelHelpers.getPrototypeOf(AppCalendar).apply(this, arguments)
        );
      }

      babelHelpers.createClass(AppCalendar, [
        {
          key: 'initialize',
          value: function initialize() {
            babelHelpers
              .get(
                babelHelpers.getPrototypeOf(AppCalendar.prototype),
                'initialize',
                this
              )
              .call(this);
          }
        },
        {
          key: 'process',
          value: function process() {
            babelHelpers
              .get(
                babelHelpers.getPrototypeOf(AppCalendar.prototype),
                'process',
                this
              )
              .call(this);
            this.handleFullcalendar(this.handleSelective);
            this.handleEventList();
          }
        },
        {
          key: 'handleFullcalendar',
          value: function handleFullcalendar(handleSelective) {
            console.log(appointments);
            var myEvents = appointments.map(x => ({
              id: x.id,
              title: x.title,
              start: moment(x.start).format('YYYY-MM-DDTHH:mm:ss'),
              end: moment(x.end).format('YYYY-MM-DDTHH:mm:ss'),
              backgroundColor: (0, _Config.colors)(x.backgroundColor, 600),
              borderColor: (0, _Config.colors)(x.backgroundColor, 600),
              clientId: x.clientId,
              backgroundColorWord: x.backgroundColor
            }));
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();

            today = yyyy + '-' + mm + '-' + dd;
            var myOptions = {
              header: {
                left: null,
                center: 'prev,title,next',
                right: 'month,agendaWeek,agendaDay'
              },
              defaultDate: today,
              selectable: true,
              selectHelper: true,
              select: function select(event) {
                appointment = '';
                handleSelective();
                var color = (0, _Config.colors)('blue', 600);
                $('#newColor [type=radio]').each(function() {
                  var $this = $(this);

                  var _value = $this.data('color').split('|');

                  var value = (0, _Config.colors)(_value[0], _value[1]);

                  if (value === color) {
                    $this.prop('checked', true);
                  } else {
                    $this.prop('checked', false);
                  }
                });
                $('#newDate').val(event.format('MM/DD/YYYY'));
                $('#addNewEvent')
                  .modal('show')
                  .one('hidden.bs.modal', function(e) {
                    console.log(e);
                    var color = $('#newColor [type=radio]:checked')
                      .data('color')
                      .split('|');
                    var date = moment(new Date($('#newDate').val())).format(
                      'YYYY-MM-DD'
                    );
                    var time12Split = $('#newTime')
                      .val()
                      .split(' ');
                    var timeSplit = time12Split[0].split(':');
                    var hour24 = parseInt(timeSplit[0]) + 12;
                    timeSplit[0] = hour24;
                    var time =
                      time12Split[1] == 'am'
                        ? time12Split[0]
                        : timeSplit.join(':');
                    time = time + ':00';

                    var timeSplitAddHour = time.split(':');
                    var addHour = parseInt(timeSplitAddHour[0]) + 1;
                    timeSplitAddHour[0] = addHour.toString();
                    timeSplitAddHour[0] =
                      timeSplitAddHour[0].length < 2
                        ? '0' + timeSplitAddHour[0]
                        : timeSplitAddHour[0];

                    console.log(date + 'T' + time);

                    var command = {
                      title: $('#newTitle').val(),
                      start: moment(date + 'T' + time).format(
                        'YYYY-MM-DDTHH:mm:ss'
                      ),
                      end: moment(
                        date + 'T' + timeSplitAddHour.join(':')
                      ).format('YYYY-MM-DDTHH:mm:ss'),
                      backgroundColor: color[0],
                      clientId: $('.addMember-item').get(0).id
                    };
                    appointments.push(command);
                    $.ajax({
                      type: 'POST',
                      url: '/appointments/save',
                      contentType: 'application/json',
                      headers: { 'X-CSRF-TOKEN': _csrf_token },
                      data: JSON.stringify(command),
                      success: function(response) {
                        $('#calendar').fullCalendar('removeEvents');
                        $('#calendar').fullCalendar(
                          'addEventSource',
                          appointments
                        );
                        $('#calendar').fullCalendar('rerenderEvents');
                      },
                      error: function(e) {
                        alert('Error: ' + e);
                      }
                    });
                  });
              },
              editable: true,
              eventLimit: true,
              windowResize: function windowResize(view) {
                var width = $(window).outerWidth();
                var options = Object.assign({}, myOptions);
                options.events = view.calendar.clientEvents();
                options.aspectRatio = width < 667 ? 0.5 : 1.35;
                $('#calendar').fullCalendar('destroy');
                $('#calendar').fullCalendar(options);
              },
              eventClick: function eventClick(event) {
                appointment = event;
                handleSelective();
                var color = event.backgroundColor
                  ? event.backgroundColor
                  : (0, _Config.colors)('blue', 600);
                $('#editEname').val(event.title);

                if (event.start) {
                  $('#editStarts').datepicker('update', event.start._d);
                  $('#editTime').val(event.start.format('hh:mm a'));
                } else {
                  $('#editStarts').datepicker('update', '');
                  $('#editTime').val('');
                }

                $('#editColor [type=radio]').each(function() {
                  var $this = $(this);

                  var _value = $this.data('color').split('|');

                  var value = (0, _Config.colors)(_value[0], _value[1]);

                  if (value === color) {
                    $this.prop('checked', true);
                  } else {
                    $this.prop('checked', false);
                  }
                });
                $('#delete').click(function(e) {
                  var indexToRemove = appointments.indexOf(
                    appointments.find(x => x.id === event.id)
                  );
                  appointments.splice(indexToRemove, 1);

                  if (event.id) {
                    var url = '/appointments/' + event.id;
                    $.ajax({
                      type: 'delete',
                      url: url,
                      contentType: 'application/json',
                      headers: { 'X-CSRF-TOKEN': _csrf_token },
                      success: function(response) {
                        $('#calendar').fullCalendar('removeEvents');
                        $('#calendar').fullCalendar(
                          'addEventSource',
                          appointments
                        );
                        $('#calendar').fullCalendar('rerenderEvents');
                      },
                      error: function(e) {
                        $('#calendar').fullCalendar('removeEvents');
                        $('#calendar').fullCalendar(
                          'addEventSource',
                          appointments
                        );
                        $('#calendar').fullCalendar('rerenderEvents');
                      }
                    });
                  }
                });
                $('#editNewEvent')
                  .modal('show')
                  .one('hidden.bs.modal', function(e) {
                    event.title = $('#editEname').val();
                    var color = $('#editColor [type=radio]:checked')
                      .data('color')
                      .split('|');
                    var realColor = (0, _Config.colors)(color[0], color[1]);
                    event.backgroundColor = realColor;
                    event.borderColor = realColor;
                    var time12Split = $('#editTime')
                      .val()
                      .split(' ');
                    var timeSplit = time12Split[0].split(':');
                    var hour24 = parseInt(timeSplit[0]) + 12;
                    timeSplit[0] = hour24;
                    var time =
                      time12Split[1] == 'am'
                        ? time12Split[0]
                        : timeSplit.join(':');
                    time = time + ':00';

                    var date = $('#editStarts')
                      .data('datepicker')
                      .getDate()
                      .toISOString()
                      .substring(0, 10);
                    event.start = moment(date + 'T' + time);

                    var timeSplitAddHour = time.split(':');
                    var addHour = parseInt(timeSplitAddHour[0]) + 1;
                    timeSplitAddHour[0] = addHour.toString();
                    timeSplitAddHour[0] =
                      timeSplitAddHour[0].length < 2
                        ? '0' + timeSplitAddHour[0]
                        : timeSplitAddHour[0];

                    event.end = moment(date + 'T' + timeSplitAddHour.join(':'));
                    var command = {
                      id: event.id,
                      title: event.title,
                      start: event.start.format('YYYY-MM-DDTHH:mm:ss'),
                      end: event.end.format('YYYY-MM-DDTHH:mm:ss'),
                      backgroundColor: color[0],
                      clientId: event.clientId
                    };
                    $.ajax({
                      type: 'POST',
                      url: '/appointments/save',
                      contentType: 'application/json',
                      headers: { 'X-CSRF-TOKEN': _csrf_token },
                      data: JSON.stringify(command),
                      success: function(response) {
                        // do something ...
                      },
                      error: function(e) {
                        alert('Error: ' + e);
                      }
                    });
                    $('#calendar').fullCalendar('updateEvent', event);
                  });
              },
              eventDragStart: function eventDragStart() {},
              eventDragStop: function eventDragStop(event) {
                var date = dragDate.format('YYYY-MM-DD');
                var time = event.start.format('HH:mm:ss');
                var command = {
                  id: event.id,
                  title: event.title,
                  start: moment(date + 'T' + time).format(
                    'YYYY-MM-DDTHH:mm:ss'
                  ),
                  end: moment(date + 'T' + time)
                    .add(1, 'hours')
                    .format('YYYY-MM-DDTHH:mm:ss'),
                  backgroundColor: event.backgroundColorWord,
                  clientId: event.clientId
                };
                $.ajax({
                  type: 'POST',
                  url: '/appointments/save',
                  contentType: 'application/json',
                  headers: { 'X-CSRF-TOKEN': _csrf_token },
                  data: JSON.stringify(command),
                  success: function(response) {
                    // do something ...
                  },
                  error: function(e) {
                    alert('Error: ' + e);
                  }
                });
              },
              events: myEvents,
              droppable: true
            };

            var _options;

            var myOptionsMobile = Object.assign({}, myOptions);
            myOptionsMobile.aspectRatio = 0.5;
            _options =
              $(window).outerWidth() < 667 ? myOptionsMobile : myOptions;
            $('#editNewEvent').modal();
            $('#calendar').fullCalendar(_options);
          }
        },
        {
          key: 'handleSelective',
          value: function handleSelective() {
            var member = clients.map(x => {
              return {
                id: x.id,
                name: x.name,
                avatar:
                  '/images/portraits/' +
                  (Math.floor(Math.random() * 20) + 1) +
                  '.jpg'
              };
            });
            var items = [member.find(x => x.id === appointment.clientId)];
            $('.plugin-selective').selective({
              namespace: 'addMember',
              local: member,
              selected: [items[items.length - 1]],
              buildFromHtml: false,
              tpl: {
                optionValue: function optionValue(data) {
                  return data.id;
                },
                frame: function frame() {
                  return '<div class="'
                    .concat(this.namespace, '">\n          ')
                    .concat(
                      this.options.tpl.items.call(this),
                      '\n          <div class="'
                    )
                    .concat(this.namespace, '-trigger">\n          ')
                    .concat(
                      this.options.tpl.triggerButton.call(this),
                      '\n          <div class="'
                    )
                    .concat(this.namespace, '-trigger-dropdown">\n          ')
                    .concat(
                      this.options.tpl.list.call(this),
                      '\n          </div>\n          </div>\n          </div>'
                    );
                },
                triggerButton: function triggerButton() {
                  return '<div class="'.concat(
                    this.namespace,
                    '-trigger-button"><i class="md-plus"></i></div>'
                  );
                },
                listItem: function listItem(data) {
                  return '<li class="'
                    .concat(
                      this.namespace,
                      '-list-item"><img class="avatar" src="'
                    )
                    .concat(data.avatar, '">')
                    .concat(data.name, '</li>');
                },
                item: function item(data) {
                  return '<li class="'
                    .concat(
                      this.namespace,
                      '-item" id="' + data.id + '"><img class="avatar" src="'
                    )
                    .concat(data.avatar, '" title="')
                    .concat(data.name, '">')
                    .concat(this.options.tpl.itemRemove.call(this), '</li>');
                },
                itemRemove: function itemRemove() {
                  return '<span class="'.concat(
                    this.namespace,
                    '-remove"><i class="md-minus-circle"></i></span>'
                  );
                },
                option: function option(data) {
                  return '<option value="'
                    .concat(this.options.tpl.optionValue.call(this, data), '">')
                    .concat(data.name, '</option>');
                }
              }
            });
          }
        },
        {
          key: 'handleEventList',
          value: function handleEventList() {
            $('#addNewEventBtn').on('click', function() {
              $('#addNewEvent').modal('show');
            });
            $('.calendar-list .calendar-event').each(function() {
              var $this = $(this);
              var color = $this.data('color').split('-');
              $this.data('event', {
                title: $this.data('title'),
                stick: $this.data('stick'),
                backgroundColor: (0, _Config.colors)(color[0], color[1]),
                borderColor: (0, _Config.colors)(color[0], color[1])
              });
              $this.draggable({
                zIndex: 999,
                revert: true,
                revertDuration: 0,
                appendTo: '.page',
                helper: function helper() {
                  return '<a class="fc-day-grid-event fc-event fc-start fc-end" style="background-color:'
                    .concat(
                      (0, _Config.colors)(color[0], color[1]),
                      ';border-color:'
                    )
                    .concat(
                      (0, _Config.colors)(color[0], color[1]),
                      '">\n          <div class="fc-content">\n            <span class="fc-title">'
                    )
                    .concat(
                      $this.data('title'),
                      '</span>\n          </div>\n          </a>'
                    );
                }
              });
            });
          }
        }
      ]);
      return AppCalendar;
    })(_Site2.default);

  _exports.AppCalendar = AppCalendar;
  var instance = null;

  function getInstance() {
    if (!instance) {
      instance = new AppCalendar();
    }

    return instance;
  }

  function run() {
    var app = getInstance();
    app.run();
  }

  var _default = AppCalendar;
  _exports.default = _default;
});
