SystemJS.config({
    map: {
        'jquery': '/node_modules/jquery/dist/jquery.js',
    }
});
SystemJS.import('/js/background.js');
