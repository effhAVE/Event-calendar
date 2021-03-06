<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" transition="dialog-bottom-transition" persistent>
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click.native="close">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title
            >{{ $t("calendarEventEditTitle") }}:
            {{ event.name }}</v-toolbar-title
          >
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text @click.native="confirmEdit">{{
              $t("buttonSaveText")
            }}</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-container>
          <v-list three-line>
            <v-list-item>
              <v-list-item-content>
                <v-text-field
                  v-model="eventEdited.name"
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
                      v-model="eventEdited.sDate"
                      :label="$t('eventStartdate')"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="eventEdited.sDate"
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
                      v-model="eventEdited.sTime"
                      :label="$t('eventStarttime')"
                      prepend-icon="mdi-clock"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker v-model="eventEdited.sTime"></v-time-picker>
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
                      v-model="eventEdited.eDate"
                      :label="$t('eventEnddate')"
                      prepend-icon="mdi-calendar-check"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="eventEdited.eDate"
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
                      v-model="eventEdited.eTime"
                      :label="$t('eventEndtime')"
                      prepend-icon="mdi-clock"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker v-model="eventEdited.eTime"></v-time-picker>
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
                      v-model="eventEdited.color"
                      :label="$t('eventColor')"
                      prepend-icon="mdi-brush"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-color-picker
                    v-model="eventEdited.color"
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
                  :value="event.details"
                  v-model="eventEdited.details"
                ></v-textarea>
              </v-list-item-content>
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
    event: {
      type: Object,
      required: true
    },
    dialog: {
      default: false
    }
  },

  data() {
    return {
      eventEdited: {},
      datepickerEnd: false,
      datepickerStart: false,
      timepickerStart: false,
      timepickerEnd: false
    };
  },
  computed: {
    startDate() {
      let dateString = this.eventEdited.sDate + " " + this.eventEdited.sTime;
      return new Date(dateString);
    },
    endDate() {
      let dateString = this.eventEdited.eDate + " " + this.eventEdited.eTime;
      return new Date(dateString);
    }
  },
  watch: {
    dialog() {
      this.eventEdited = Object.assign(
        {
          sDate: this.event.startDate.split(" ")[0],
          sTime: this.event.startDate.split(" ")[1],
          eDate: this.event.endDate.split(" ")[0],
          eTime: this.event.endDate.split(" ")[1]
        },
        this.event
      );
    }
  },
  methods: {
    close() {
      this.$emit("update:dialog", false);
      this.eventEdited = {};
    },
    async confirmEdit() {
      const eventEdited = this.eventEdited;
      const dbEvent = {
        startDate: this.startDate,
        endDate: this.endDate,
        color: eventEdited.color,
        details: eventEdited.details,
        name: eventEdited.name
      };

      const [res] = await api.editEvent(
        this.$store.state.user._id,
        eventEdited._id,
        dbEvent
      );

      this.$emit("update:dialog", false);

      if (res) {
        this.$emit("eventEdited", res);
      }
    }
  }
};
</script>