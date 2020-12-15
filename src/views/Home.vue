<template>
  <div class="home">
    <v-app id="inspire">
      <v-navigation-drawer v-model="drawer" app>
        <v-list flat>
          <v-subheader>USERS</v-subheader>
          <v-list-item-group v-model="selectedUser" color="primary" v-if="!userListLoading">
            <v-list-item v-for="(user, index) in userList" :key="index">
              <v-list-item-icon>
                <v-icon>far fa-user-circle</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{user.name}}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
          <v-col cols="12" class="flex-column" v-else>
            <v-skeleton-loader :boilerplate="true" type="list-item-avatar" class="mb-6" v-for="index in 8" :key="index"></v-skeleton-loader>
          </v-col>
        </v-list>
      </v-navigation-drawer>

      <v-app-bar color="light-blue" flat app>
        <v-app-bar-nav-icon @click="drawer = !drawer" class="white--text"></v-app-bar-nav-icon>

        <v-toolbar-title class="white--text">Rota</v-toolbar-title>
        <v-spacer></v-spacer>

        <v-btn @click="populateData" :loading="userListLoading || rotaListLoading" :disabled="userListLoading || rotaListLoading" class="mr-4">
          populate
        </v-btn>

        <v-btn @click="generateNewRota" :loading="newRotaLoading" :disabled="newRotaLoading">
          generate rota
        </v-btn>
        

        <template v-slot:extension v-if="!rotaListLoading">
          <v-tabs v-model="tab" align-with-title fixed-tabs>
            <v-tabs-slider color="white"></v-tabs-slider>
            <v-tab active-class="white--text">Calendar</v-tab>
            <v-tab active-class="white--text">Accordion</v-tab>
          </v-tabs>
        </template>
      </v-app-bar>

      <v-main class="grey lighten-4 px-10 py-10 d-flex">
        <v-sheet
          tile
          class="d-flex align-center py-6"
          v-if="!rotaListLoading"
        >
          <v-select
            v-model="activeRota"
            :items="rotaPeriodSelectList"
            dense
            outlined
            hide-details
            class="mx-14"
            label="Rota Period"
          ></v-select>
        </v-sheet>
        <v-tabs-items v-model="tab" v-if="!rotaListLoading">

          <!-- Calendar Item -->
          <v-tab-item>
            <v-sheet tile height="54" class="d-flex align-center">
              <v-spacer></v-spacer>
              <v-toolbar-title v-if="$refs.calendar">
                {{ $refs.calendar.title }}
              </v-toolbar-title>
              <v-spacer></v-spacer>
            </v-sheet>
            <v-sheet height="700" class="mt-2">
              <v-calendar ref="calendar" 
                :weekdays="weekdays"
                @change="getEvents"
                :event-color="getEventColor"
                :start="activeRotaDates.start"
                :end="activeRotaDates.end"
                :events="events">
              </v-calendar>
            </v-sheet>
          </v-tab-item>

          <!-- Accordion Item -->
          <v-tab-item>
            <v-card>
              <v-row justify="center">
                <v-expansion-panels accordion>
                  <v-expansion-panel v-for="(events, key, i) in accordionEventsData" :key="i">
                    <v-expansion-panel-header>{{key}}</v-expansion-panel-header>
                    <v-expansion-panel-content class="flex-row align-center">
                      <v-card class="mx-4 my-2 px-4 py-2" :color="event.color" v-for="(event, index) in events" :key="`${index}a`">{{event.name}} - {{event.type}} shift</v-card>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-row>
            </v-card>
          </v-tab-item>

        </v-tabs-items>
        <v-card v-else class="d-flex flex-grow-1 align-center justify-center transparent" flat>
          <v-progress-circular
            :size="50"
            :width="3"
            color="black"
            indeterminate
          ></v-progress-circular>
        </v-card>
      </v-main>
    </v-app>
    
    <v-snackbar
      :timeout="-1"
      :value="true"
      :color="success ? `green` : `red`"
      right
      rounded="pill"
      bottom
      class="m"
      v-model="showSnackBar"
    >{{success || error || ''}}</v-snackbar>
  </div>
</template>

<script lang="ts">
import { User } from '@/model/user.model';
import { Event } from '@/model/event.model';
import Vue from 'vue';
import { mapActions, mapGetters, mapState } from 'vuex';
import { RotaList } from '@/model/rota-list.model';
import { Rota } from '@/model/rota.model';
import { RotaType } from '@/model/rota-type.enum';
import { filter } from 'vue/types/umd';

export default Vue.extend({
  name: 'Home',
  async created() {
    await this.populateData()
  },
  data: () => ({
    drawer: null,
    tab: null,
    selectedUser: undefined as unknown as User,
    weekdays: [0, 1, 2, 3, 4, 5, 6],
    eventTypes: [],
    events: [] as Event[],
    activeRota: {} as RotaList,
    showSnackBar: false
  }),
  computed: {
    ...mapState([
      'rotaList',
      'rotaListLoading',
      'userList',
      'userListLoading',
      'error',
      'newRotaLoading',
      'success'
    ]),
    ...mapGetters(['getUserRotas']),
    rotaPeriodSelectList(){
      return (this.rotaList as RotaList[]).map(rota => ({
        text: `From: ${rota.rotaPeriod.startDate}, To: ${rota.rotaPeriod.endDate}`,
        value: rota
      }))
    },
    activeRotaDates(){
      return {
        start: this.activeRota?.rotaPeriod?.startDate,
        end: this.activeRota?.rotaPeriod?.endDate
      }
    },
    accordionEventsData(){
      let dates: Set<string>;
      let rotaData: RotaList;
      if (this.selectedUser !== undefined) {
        rotaData = (this.getUserRotas as RotaList[]).filter(rota => rota.rotaId === this.activeRota.rotaId)[0]
        dates = new Set(rotaData?.rotas?.map(rota => rota.date))
      } else {
        rotaData = (this.activeRota as RotaList)
        dates = new Set((this.activeRota as RotaList)?.rotas?.map(rota => rota.date)) 
      }
      const eventsData: any = [...dates].reduce((accumulator: any, current) => {
        if (accumulator[current]) {
          accumulator[current].push(
            ...rotaData.rotas.filter(rota => rota.date === current).map(x => ({
              type: x.type,
              name: x.user.name,
              color: x.type === RotaType.morning ? 'orange' : 'green'
            }))
          )
        } else {
          accumulator[current] = []
          accumulator[current].push(
            ...rotaData.rotas.filter(rota => rota.date === current).map(x => ({
              type: x.type,
              name: x.user.name,
              color: x.type === RotaType.morning ? 'orange' : 'green'
            }))
          )
        }
        return accumulator
      }, {})
      return eventsData;
    }
  },
  methods: {
    ...mapActions([
      'loadRotaList',
      'loadUserList',
      'generateNewRota',
      'setActiveUser'
    ]),
    getEvents({start, end}: {
      start?: any;
      end?: any;
    }) {
      const events: Event[] = []
      
      let filteredRotas: any;
      let min: Date;
      let max: Date;
      let eventCount: number;

      if (this.selectedUser !== undefined) {
        filteredRotas = (this.getUserRotas as RotaList[]).filter(rota => rota.rotaId === this.activeRota.rotaId)?.[0] ?? {}
        min = new Date(`${filteredRotas?.rotaPeriod?.startDate ?? start?.date}T00:00:00`)
        max = new Date(`${filteredRotas?.rotaPeriod?.endDate ?? end?.date}T23:59:59`)
        eventCount = filteredRotas?.rotas?.length
      } else {
        filteredRotas = undefined
        min = new Date(`${start?.date}T00:00:00`)
        max = new Date(`${end?.date}T23:59:59`)
        eventCount = this.activeRota?.rotas?.length
      }
      
      const days = (max.getTime() - min.getTime()) / 86400000
      
      for (let i = 0; i < eventCount; i++) {
        const element: Rota = (filteredRotas ?? this.activeRota)?.rotas[i];
        const startTime: Date = new Date(`${element.date}${element.type === RotaType.morning ? 'T00:00:00' : 'T11:59:59'}`)
        const endTime: Date = new Date(`${element.date}${element.type === RotaType.morning ? 'T12:00:00' : 'T23:59:59'}`)

        const event: Event = {
          name: element.user.name,
          start: startTime,
          end: endTime,
          color: element.type === RotaType.morning ? 'orange' : 'green',
          timed: true
        }
        events.push(event)
      }

      this.events = events
    },
    getEventColor(event: Event) {
      return event.color;
    },
    async populateData(){
      await Promise.all([this.loadUserList(), this.loadRotaList()])
      this.selectedUser = undefined as unknown as User
      this.activeRota = this.rotaList[0]
    }
  },
  watch: {
    selectedUser: function(newVal?: number){
      this.setActiveUser(newVal !== undefined ? (this.userList as User[])?.[newVal] : undefined)
      this.getEvents({
        start: this.$refs.calendar?.parsedStart,
        end: this.$refs.calendar?.parsedEnd
      })
    },
    activeRota: function(val?: RotaList) {
      this.getEvents({
        start: this.$refs.calendar?.parsedStart,
        end: this.$refs.calendar?.parsedEnd
      })
    },
    error: function(newVal: string){
      if (newVal) {
        this.showSnackBar = true
      } else {
        this.showSnackBar = false
      }
    },
    success: function(newVal){
      if (newVal) {
        this.showSnackBar = true
      } else {
        this.showSnackBar = false
      }
    },
  }
});
</script>
