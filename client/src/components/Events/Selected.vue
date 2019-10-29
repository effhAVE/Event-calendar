<template>
  <v-menu
    v-model="dialog"
    :close-on-content-click="false"
    :activator="selectedElement"
    offset-y
    bottom
    min-width="350px"
    max-width="450px"
  >
    <v-card color="grey lighten-4">
      <v-toolbar :color="selectedEvent.color" :dark="dark">
        <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="$emit('editEvent')">
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
        <v-btn text color="secondary" @click="dialog = false">
          {{ $t("buttonCancelText") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>
<script>
import api from "../../api";
export default {
  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    selectedEvent: {
      type: Object,
      required: true
    },
    selectedElement: {
      required: true
    },
    dark: {
      type: Boolean
    }
  },
  data() {
    return {};
  },
  methods: {
    async deleteEvent() {
      const deleted = await api.deleteEvent(
        this.$store.state.user._id,
        this.selectedEvent._id
      );

      if (deleted) {
        this.$emit("eventDeleted", deleted);
        this.selectedOpen = false;
        this.selectedEvent = {};
      }
    }
  }
};
</script>