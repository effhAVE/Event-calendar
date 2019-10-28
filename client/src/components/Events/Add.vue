<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" transition="dialog-bottom-transition" persistent>
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click.native="close">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{
            $t("calendarEventCreateTitle")
          }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text @click.native="createEvent">{{
              $t("buttonSaveText")
            }}</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-container>
          <v-list three-line>
            <v-list-item>
              <v-list-item-content>
                <v-text-field
                  v-model="newEvent.name"
                  :label="$t('eventName')"
                  prepend-icon="mdi-rename-box"
                ></v-text-field>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-menu
                  v-model="datepickerStart"
                  :close-on-content-click="true"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="newEvent.sDate"
                      :label="$t('eventStartdate')"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="newEvent.sDate"
                    @input="datepickerStart = false"
                  ></v-date-picker>
                </v-menu>
                <v-menu
                  v-model="timepickerStart"
                  :nudge-right="40"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="newEvent.sTime"
                      :label="$t('eventStarttime')"
                      prepend-icon="mdi-clock"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker v-model="newEvent.sTime"></v-time-picker>
                </v-menu>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-menu
                  v-model="datepickerEnd"
                  :close-on-content-click="true"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="newEvent.eDate"
                      :label="$t('eventEnddate')"
                      prepend-icon="mdi-calendar-check"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="newEvent.eDate"
                    @input="datepickerEnd = false"
                  ></v-date-picker>
                </v-menu>
                <v-menu
                  v-model="timepickerEnd"
                  :nudge-right="40"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="newEvent.eTime"
                      :label="$t('eventEndtime')"
                      prepend-icon="mdi-clock"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker v-model="newEvent.eTime"></v-time-picker>
                </v-menu>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-menu
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="newEvent.color"
                      :label="$t('eventColor')"
                      prepend-icon="mdi-brush"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-color-picker
                    v-model="newEvent.color"
                    class="mx-auto"
                  ></v-color-picker>
                </v-menu>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-textarea
                  :label="$t('eventDetails')"
                  prepend-icon="mdi-pencil"
                  v-model="newEvent.details"
                ></v-textarea>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="createEvent">Save</v-btn>
            </v-list-item>
          </v-list>
        </v-container>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import api from "../../api";
export default {
  props: {
    dialog: {
      default: false
    },

    day: {
      type: String
    }
  },

  data() {
    return {
      newEvent: {},
      datepickerEnd: false,
      datepickerStart: false,
      timepickerStart: false,
      timepickerEnd: false
    };
  },
  computed: {
    startDate() {
      let dateString = this.newEvent.sDate + " " + this.newEvent.sTime;
      return new Date(dateString);
    },
    endDate() {
      let dateString = this.newEvent.eDate + " " + this.newEvent.eTime;
      return new Date(dateString);
    }
  },
  watch: {
    dialog() {
      this.newEvent = {
        sDate: this.day,
        eDate: this.day,
        sTime: "12:00",
        eTime: "13:00",
        color: "#FF0000"
      };
    }
  },
  methods: {
    close() {
      this.$emit("update:dialog", false);
      this.newEvent = {};
    },
    async createEvent() {
      const dbEvent = {
        startDate: this.startDate,
        endDate: this.endDate,
        color: this.newEvent.color,
        details: this.newEvent.details,
        name: this.newEvent.name
      };

      const [res] = await api.saveEvent(this.$store.state.user._id, dbEvent);

      this.$emit("update:dialog", false);

      if (res) {
        this.$emit("eventAdded", res);
      }
    }
  }
};
</script>