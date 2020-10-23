<template>
  <div class="hello">
    
  </div>
</template>

<script>
import { ChatClient } from 'twitch-chat-client';
//import { ApiClient } from 'twitch';
import { StaticAuthProvider } from 'twitch-auth';

const clientId = 'e7g44jusrmcfqyl59kzxe2j4c7ud9g';
const accessToken = '';
const authProvider = new StaticAuthProvider(clientId, accessToken);
//const apiClient = new ApiClient({ authProvider });
const chatClient = new ChatClient(authProvider, { channels: ['robotfrogs3'] });

export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  async mounted() {
    await chatClient.connect();
    console.log("Connected");
    chatClient.onMessage(console.log);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
