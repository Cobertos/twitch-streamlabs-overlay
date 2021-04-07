<template>
  <div
   class="oauth-button-container"
  >
    <a
      class="oauth-button"
      :href="oauthURL">
      Auth wth Twitch
    </a>
    <div>
      <input
        type="text"
        v-model="lastAccessToken"
        placeholder="or paste your token here..."
      >
      <button
        v-text="'Submit'"
        @click="$emit('access-token', lastAccessToken)"
      />
    </div>
    <p
      class="under-text"
    >
      Do not share this, it's secret!
    </p>
  </div>
</template>

<script>
export default {
  props: {
    clientID: {
      type: String,
      required: true
    },
    redirectURI: {
      type: String,
      required: true
    },
    scope: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      lastAccessToken: ''
    };
  },
  computed: {
    oauthURL() {
      const redirectURI = window.encodeURIComponent(this.redirectURI);
      const scopeEncoded = window.encodeURIComponent(this.scope);
      return `https://id.twitch.tv/oauth2/authorize?client_id=${this.clientID}&redirect_uri=${redirectURI}&response_type=token&scope=${scopeEncoded}`;
    }
  },
  methods: {
    tryHash(){
      if(window.location.hash) {
        let params;
        try {
          params = window.location.hash
            .slice(1) // Remove leading #
            .split('&')
            .map(s => s.split('='))
            .map(([k,v]) => ({
              [k]: window.decodeURIComponent(v)
            }))
            .reduce((acc, itm) => ({ ...acc, ...itm }), {});
          if(!params.access_token) {
            throw new Error('No access_token in params');
          }
        }
        catch(e) {
          console.error('Couldnt parse OAuth response');
          console.error(e);
          return;
        }
        this.lastAccessToken = params['access_token'];
        this.$emit('access-token', params['access_token']);
      }
    }
  },
  created() {
    if(window.location.hash) {
      this.tryHash();
    }
    this.$options.hashListener = this.tryHash.bind(this);
    window.addEventListener("hashchange", this.$options.hashListener);
  },
  beforeDestroy() {
    window.removeEventListener("hashchange", this.$options.hashListener);
  }
}
</script>

<style lang="scss" scoped>
.oauth-button-container {
  display: flex;
  align-items: center;
  flex-direction: column;

  .oauth-button {
    color: #FFF;
    background-color: #6441a5;
    border-radius: 5px;
    text-decoration: none;
    padding: 4px 10px;
    margin-bottom: 10px;

    &:hover {
      background-color: lighten(#6441a5,10%);
    }
  }

  .under-text {
    font-size: 10px;
  }
}
</style>