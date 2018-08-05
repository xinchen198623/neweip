<template>
<div>
  <limitsHeader></limitsHeader>
  <router-view />
</div>
</template>

<script type="text/ecmascript-6">
  const limitsHeader = () => import('./limitsHeader.vue');
  export default {
    components:{
      limitsHeader
    }
  };

</script>
