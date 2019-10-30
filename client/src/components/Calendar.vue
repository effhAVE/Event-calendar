<template>
  <v-row>
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat color="white">
          <v-btn outlined class="mr-4" @click="setToday">
            {{ $t("calendarToday") }}
          </v-btn>
          <v-btn fab text small @click="prev">
            <v-icon small>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn fab text small @click="next">
            <v-icon small>mdi-chevron-right</v-icon>
          </v-btn>
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-menu bottom right>
            <template v-slot:activator="{ on }">
              <v-btn outlined v-on="on">
                <span>{{ $t(typeToLabel[type]) }}</span>
                <v-icon right>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>{{ $t("calendarDay") }}</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>{{ $t("calendarWeek") }}</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>{{ $t("calendarMonth") }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="calc(100vh - 152px)">
        <EventEdit
          :event="selectedEvent"
          :dialog.sync="editOpen"
          @eventEdited="updateEvent"
        />
        <EventAdd :day="focus" :dialog.sync="addOpen" @eventAdded="addEvent" />
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          event-end="endDate"
          event-start="startDate"
          :events="events"
          :event-color="getEventColor"
          :event-margin-bottom="3"
          :event-name="eventName"
          :event-text-color="setEventColor"
          :interval-format="intervalFormat"
          :locale="$vuetify.lang.current"
          :now="today"
          :type="type"
          :weekdays="weekdays"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
          @change="updateRange"
        ></v-calendar>
        <v-fab-transition>
          <v-btn
            color="primary"
            dark
            absolute
            fab
            style="bottom: 10%; right: 10%"
            v-show="type === 'day'"
            @click="addOpen = true"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-fab-transition>
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-y
          bottom
          min-width="350px"
          max-width="450px"
        >
          <v-card color="grey lighten-4">
            <v-toolbar :color="selectedEvent.color" :dark="setDarkMode">
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon @click="editEvent">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-menu bottom left offset-y>
                <template v-slot:activator="{ on }">
                  <v-btn icon v-on="on">
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item @click="deleteEvent">
                    <v-list-item-title>{{
                      $t("buttonDeleteText")
                    }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-toolbar>
            <v-card-text>
              <span v-html="selectedEvent.details"></span>
            </v-card-text>
            <v-card-actions>
              <v-btn text color="secondary" @click="selectedOpen = false">
                {{ $t("buttonCancelText") }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>
<script>
import EventEdit from "./Events/Edit";
import EventAdd from "./Events/Add";
import api from "../api";

const today = new Date();
export default {
  components: {
    EventEdit,
    EventAdd
  },
  data: () => ({
    today: [today.getFullYear(), today.getMonth() + 1, today.getDate()].join(
      "-"
    ),
    focus: [today.getFullYear(), today.getMonth() + 1, today.getDate()].join(
      "-"
    ),
    type: "month",
    typeToLabel: {
      month: "calendarMonth",
      week: "calendarWeek",
      day: "calendarDay"
    },
    start: null,
    end: null,
    weekdays: [1, 2, 3, 4, 5, 6, 0],
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    editOpen: false,
    addOpen: false,
    events: [],
    dbEventsMemory: []
  }),
  computed: {
    title() {
      const { start, end } = this;
      if (!start || !end) {
        return "";
      }

      const startMonth = this.monthFormatter(start);
      const endMonth = this.monthFormatter(end);
      const suffixMonth = startMonth === endMonth ? "" : endMonth;

      const startYear = start.year;
      const endYear = end.year;
      const suffixYear = startYear === endYear ? "" : startYear;

      const startDay = start.day;
      const endDay = end.day;

      switch (this.type) {
        case "month":
          return `${startMonth} ${startYear}`;
        case "week":
          return `${startMonth} ${startDay} ${suffixYear} - ${endMonth} ${endDay} ${endYear}`;
        case "day":
          return `${startDay} ${startMonth} ${startYear}`;
      }
      return "";
    },
    monthFormatter() {
      return this.$refs.calendar.getFormatter({
        timeZone: "UTC",
        month: "long"
      });
    },
    setDarkMode() {
      return this.setEventColor(this.selectedEvent) === "white";
    }
  },
  async mounted() {
    this.$refs.calendar.checkChange();
  },
  methods: {
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    getEventColor(event) {
      return event.color;
    },
    setToday() {
      this.focus = this.today;
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        setTimeout(() => (this.selectedOpen = true), 10);
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
    editEvent() {
      this.editOpen = true;
    },
    updateRange({ start, end }) {
      const startYear = start.date.split("-")[0];
      if (!this.dbEventsMemory.includes(startYear)) {
        this.getEvents({
          dateRangeMin: `${startYear}-01-01`,
          dateRangeMax: `${startYear}-12-31`
        });
        this.dbEventsMemory.push(startYear);
      }

      this.start = start;
      this.end = end;
    },
    async getEvents({ dateRangeMin, dateRangeMax } = {}) {
      const res = await this.$store.dispatch("getEvents", {
        dateRangeMax,
        dateRangeMin
      });

      if (res.length) {
        this.events.push(...res);
      }
    },
    intervalFormat(interval) {
      return interval.time;
    },
    eventName(ev) {
      return `<strong class="mr-2">${ev.start.time}</strong>${ev.input.name}`;
    },
    updateEvent(updated) {
      const eventIndex = this.events.findIndex(ev => ev._id === updated._id);
      this.events.splice(eventIndex, 1, updated);
    },
    addEvent(newEvent) {
      this.events.push(newEvent);
    },
    async deleteEvent() {
      const deleted = await api.deleteEvent(
        this.$store.state.user._id,
        this.selectedEvent._id
      );
      if (deleted) {
        const eventIndex = this.events.findIndex(ev => ev._id === deleted._id);
        this.events.splice(eventIndex, 1);
        this.selectedOpen = false;
        this.selectedEvent = {};
      }
    },
    setEventColor({ color }) {
      if (!color) return;
      // If a leading # is provided, remove it
      if (color.slice(0, 1) === "#") {
        color = color.slice(1);
      }

      // If a three-character hexcode, make six-character
      if (color.length === 3) {
        color = color
          .split("")
          .map(function(hex) {
            return hex + hex;
          })
          .join("");
      }

      // Convert to RGB value
      const r = parseInt(color.substr(0, 2), 16);
      const g = parseInt(color.substr(2, 2), 16);
      const b = parseInt(color.substr(4, 2), 16);

      // Get YIQ ratio
      let yiq = (r * 299 + g * 587 + b * 114) / 1000;

      // Check contrast
      return yiq >= 128 ? "black" : "white";
    }
  }
};
</script>

<style lang="scss" scoped>
.v-toolbar__title {
  margin-left: 1em;
}
</style>