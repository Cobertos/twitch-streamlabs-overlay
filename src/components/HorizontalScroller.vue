<template>
  <transition-group
    class="horizonal-scroller"
    name="horizonal-scroller"
    tag="div">
    <slot></slot>
  </transition-group>
</template>

<script>
export default {};
</script>

<style lang="scss">
.horizonal-scroller {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-direction: row;
  width: 100%;
  padding: 2px 5px;
  font-family: 'Roboto', Arial, sans-serif;
  font-weight: 300;

  > * {
    flex: 0 0 auto;
  }
}

.horizonal-scroller-enter-active, .horizonal-scroller-leave-active, .horizonal-scroller-move {
  transition: transform 0.5s;
}
</style>
