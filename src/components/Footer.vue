<template>
    <div class="footer">
        <div class="left">Copyright © 2019-2022. All rights reserved.</div>
        <div class="right">
            <a href="https:/www.baidu.com">Vue3 Demo</a>
        </div>
    </div>
</template>

<script>
export default {
    name:'Footer'
};

</script>

<style>
.footer{
    height: 50px;
    border-top: 1px solid #e9e9e9;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
}
</style>