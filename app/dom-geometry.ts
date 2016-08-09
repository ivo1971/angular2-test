//source: https://www.softcomplex.com/docs/get_window_size_and_scrollbar_position.html

export function getViewportHeight() : number
{
    var windowHeight : number = 0;
    if (typeof(window.innerHeight) == 'number')
    {
        // DOM compliant, IE9+
        windowHeight = window.innerHeight;
    }
    else
    {
        // IE6-8 workaround, Note: document can be smaller than window
        var ieStrict = document.documentElement.clientHeight; // w/out DTD gives 0
        var ieQuirks = document.body.clientHeight; // w/DTD gives document height
        windowHeight = (ieStrict > 0) ? ieStrict : ieQuirks;
    }
    return windowHeight;
}

export function getViewportWidth() : number
{
    var windowWidth : number = 0;
    if (typeof(window.innerWidth) == 'number')
    {
        // DOM compliant, IE9+
        windowWidth = window.innerWidth;
    }
    else
    {
        // IE6-8 workaround, Note: document can be smaller than window
        var ieStrict = document.documentElement.clientWidth; // w/out DTD gives 0
        var ieQuirks = document.body.clientWidth; // w/DTD gives document width
        windowWidth = (ieStrict > 0) ? ieStrict : ieQuirks;
    }
    return windowWidth;
}
 
export function getWindwoScrollTop() : number
{
    var scrollTop : number = 0;
    if(typeof(window.pageYOffset) == 'number')
    {
        // DOM compliant, IE9+
        scrollTop = window.pageYOffset;
    }
    else
    {
        // IE6-8 workaround
        if(document.body && document.body.scrollTop)
        {
            // IE quirks mode
            scrollTop = document.body.scrollTop;
        }
        else if(document.documentElement && document.documentElement.scrollTop)
        {
            // IE6+ standards compliant mode
            scrollTop = document.documentElement.scrollTop;
        }
    }
    return scrollTop;
}
 
export function getWindowScrollLeft() : number
{
    var scrollLeft : number = 0;
    if(typeof(window.pageXOffset) == 'number')
    {
        // DOM compliant, IE9+
        scrollLeft = window.pageXOffset;
    }
    else
    {
        // IE6-8 workaround
        if(document.body && document.body.scrollLeft)
        {
            // IE quirks mode
            scrollLeft = document.body.scrollLeft;
        }
        else if(document.documentElement && document.documentElement.scrollLeft)
        {
            // IE6+ standards compliant mode
            scrollLeft = document.documentElement.scrollLeft;
        }
    }
    return scrollLeft;
}
