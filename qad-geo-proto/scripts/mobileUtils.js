function isMobilePlatform() { 
    if( navigator.userAgent.match(/Android/i)
            || navigator.userAgent.match(/iPhone/i)
            || navigator.userAgent.match(/iPad/i)
      ){
        return true;
    }
    else {
        return false;
    }
}

