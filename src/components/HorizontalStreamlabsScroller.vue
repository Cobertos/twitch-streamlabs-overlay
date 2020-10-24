<template>
  <horizontal-scroller>
    <template
      v-for="(m, idx) in messages.slice().reverse()"
    >
      <span
        class="chat-message"
        :key="'0'+m.id"
        v-text="m.text"
      />
      <span
        v-if="idx !== messages.length - 1"
        class="chat-separator"
        :key="'1'+m.id">
        ⬩
      </span>
    </template>
  </horizontal-scroller>
</template>

<script>
import { StreamlabsClient } from 'streamlabs-ws-client';

import HorizontalScroller from './HorizontalScroller.vue';
export default {
  components: { HorizontalScroller },
  props: {
    accessToken: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      client: undefined,
      messages: []
    }
  },
  watch: {
    accessToken(token){
      this.createClient(token);
    }
  },
  methods: {
    async createClient(token) {
      if(this.client) {
        this.destroyClient();
      }
      const resp = await fetch(`https://streamlabs.com/api/v1.0/socket/token?access_token=${token}`);
      const json = await resp.json();

      const streamlabsEvents = [
        "follow",
        "bits",
        //"host",
        //"raid",
        //"merch",
        "subscription",
        //"resubscription",
        "donation"
      ];
      this.client = new StreamlabsClient({
          token: json.socket_token,
          emitTests: true,
      });

      for (const streamEvent of streamlabsEvents) {
        this.client.on(streamEvent, async (data) => {
          console.info(`[STREAMLABS-EVENT] Event: ${streamEvent}`, JSON.stringify(data, null, 4));
          this.messages = [{
              id: ''+Math.random(),
              text: `${streamEvent} happened`
            },
            ...this.messages.slice(0,10)
          ];
        });
      }
      this.client.connect();
      console.log("Connected to Streamlabs");
    },
    destroyClient() {
      if(this.client) {
        this.client.disconnect();
        this.client = undefined;
        console.log("Disconnected from Streamlabs");
      }
    }
  },
  created() {
    if(this.accessToken) {
      this.createClient(this.accessToken);
    }
  },
  beforeDestroy() {
    if(this.client) {
      this.destroyClient();
    }
  }
};
</script>

<style lang="scss">
.chat-separator {
  margin: 0 15px;
}
</style>
