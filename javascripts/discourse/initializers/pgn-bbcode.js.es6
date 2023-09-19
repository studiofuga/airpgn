// allow markdown-it: 

export function setup(helper) {
    if(!helper.markdownIt) { return; }
    
    helper.registerOptions((opts,siteSettings)=>{
        opts.features.['pgn_viewer'] = !!siteSettings.pgn_viewer_enabled;
    });
    
    helper.allowList(['span.pgnv', 'div.pgnv']);
    
    helper.registerPlugin(md=>{
        // wrapper of the content is a new token
        md.block.bbcode.ruler.push('pgnv', {
            tag: 'pgnv',
            wrap:  pgnViewerInterface(state, tagInfo, content)});
    });
}

// define a new BBcode like this
// [pgnv id=board pieceStyle=merida locale=fr orientation=black theme=chesscom boardSize=200px size=500px] 
// 1. e4 e5 2. Nf3 Nc6 3. Bb5 
// [/pgnv]
// First we have the tag, then the tagInfo, to be used for configuration, and then the block
// that's the actual game, stored in 'pgn' variable
// according to documentation (https://mliebelt.github.io/PgnViewerJS/examples.html#1001)
// in order to use the javascript engine, the following e.g. javascript:
//      var pgn = "1. f4 e6 2. g4 Qh4#";
//      var board = PGNV.pgnView('board', {pgn: pgn});
// must be used into this HTML code:
//      <div id="board" style="width: 400px"></div>
// So we need to create the HTML which translates the BBcode accordingly, 
// making the variables explicit



window.console.log("DEBUG - bbcode start?");
// function pgnViewerInterface(state, silent) {
// function pgnViewerInterface(token, tagInfo, content) {
function pgnViewerInterface(state, tagInfo, content) {
    // standard markdown it inline extension goes here.
    let token;
    window.console.log("DEBUG - bbcode ruler start.");
    //read value from tagInfo or assign default value
    const locale         = (tagInfo.attrs['locale'] || 'it_IT').trim();
    const id             = (tagInfo.attrs['id'] || 'board').trim();
    const fen            = (tagInfo.attrs['fen'] || null).trim();
    const position       = (tagInfo.attrs['position'] || 'start').trim();
    const pieceStyle     = (tagInfo.attrs['pieceStyle'] || 'merida').trim(); // 'wikipedia', 'alpha', 'uscf' (all from chessboardjs), 'case', 'condal', 'maya', 'merida' (my favorite), 'leipzig' (all from ChessTempoViewer), and 'beyer' (from German chess books).
    const orientat       = (tagInfo.attrs['orientation'] || 'white').trim();
    const theme          = (tagInfo.attrs['theme'] || 'zeit').trim();
    const boardsize      = (tagInfo.attrs['boardsize'] || null).trim();
    const size           = (tagInfo.attrs['size'] || null).trim();
    const showcoords     = (Boolean(tagInfo.attrs['showcoords']) || true).trim();
    const layout         = (tagInfo.attrs['layout'] || null).trim();
    const movesheight    = (tagInfo.attrs['movesheight'] || null).trim();
    const colormarker    = (tagInfo.attrs['colormarker'] || null).trim();
    const showresult     = (tagInfo.attrs['showresult'] || false).trim();
    const coordsinner    = (tagInfo.attrs['coordsinner'] || true).trim();
    const coordsfactor   = (tagInfo.attrs['coordsfactor'] || 1).trim();
    const startplay      = (tagInfo.attrs['startplay'] || null).trim();
    const headers        = (tagInfo.attrs['headers'] || true).trim();
    const notation       = (tagInfo.attrs['notation'] || null).trim();
    const notationlayout = (tagInfo.attrs['notationlayout'] || null).trim();
    const showfen        = (tagInfo.attrs['showfen'] || false).trim();
    const coordsfontsize = (tagInfo.attrs['coordsfontsize'] || null).trim();
    const timertime      = (tagInfo.attrs['timertime'] || null).trim();
    const width          = (tagInfo.attrs['width'] || '200px').trim();
    const hidemovesbefore= (tagInfo.attrs['hidemovesbefore'] || null).trim();
    
    if (id === null) {
        id = "board";
    }
    var undef, i, len;
    var emptyValues = [undef, null, false, 0, '', '0'];
    for (i = 0, len = emptyValues.length; i < len; i++)
    {
        if (fen === emptyValues[i])
        {
            position = fen;
            break;
        }
    }
    
    //debug print
    text = "Parameters: ";
    text += "ID: "+id;
    text += " locale: "+locale+" piecestyle: "+piecestyle+" orientation: "+orientat;
    text += " theme: "+theme+" boardsize: "+boardsize+" width: "+size+" position: "+position;
    text += " showCoords: "+showcoords+" layout: "+layout+" movesheight: "+movesheight;
    text += " colormarker: "+colormarker+" showresult: "+showresult+" coordsinner: "+coordsinner;
    text += " coordsfactor: "+coordsfactor+" startplay: "+startplay+" headers: "+headers;
    text += " showresult: "+showresult+" notation: "+notation+" notationLayout: "+notationlayout;
    text += " showfen: "+showfen+" coordsfontsize: "+coordsfontsize+" timertime: "+timertime;
    text += " hideMovesBefore: "+hidemovesbefore;
    // config2 = array_filter({"locale":locale,"pieceStyle":piecestyle,"orientation":orientation,"theme":theme,"boardSize":boardsize,"width":size,"position":position,"showCoords":showcoords,"layout":layout,"movesHeight":movesheight,"colorMarker":colormarker,"showResult":showresult,"coordsInner":coordsinner,"coordsFactor":coordsfactor,"startPlay":startplay,"headers":headers,"showResult":showresult,"notation":notation,"notationLayout":notationlayout,"showFen":showfen,"coordsFontSize":coordsfontsize,"timerTime":timertime,"hideMovesBefore":hidemovesbefore});
    
    
    
    config2 = removeEmptyValues({"locale":locale,"pieceStyle":pieceStyle,"orientation":orientat,"theme":theme,"boardSize":boardsize,"width":size,"position":position,"showCoords":showcoords,"layout":layout,"movesHeight":movesheight,"colorMarker":colormarker,"showResult":showresult,"coordsInner":coordsinner,"coordsFactor":coordsfactor,"startPlay":startplay,"headers":headers,"showResult":showresult,"notation":notation,"notationLayout":notationlayout,"showFen":showfen,"coordsFontSize":coordsfontsize,"timerTime":timertime,"width":width,"hideMovesBefore":hidemovesbefore});
    non_string = {0:"headers",1:"showCoords",2:"coordsInner",3:"showFen",4:"hideMovesBefore",5:"showResult",6:"coordsFactor",7:"timerTime",8:"coordsFontSize"};
    config_string = "";
    for(var key in config2) {
        value = config2[key];
        config_string += ", "+key+": ";
        if (in_array(key, non_string)) {
            config_string += value;
        } else {
            config_string += "'"+value+"'";
        }
    }
    
    // the content is the actual gameplay as notification, to be formatted properly 
    cleaned = cleanup_pgnv(content);
    // add the pgn-viewer library
    library = "<script src=\"../lib/@mliebelt/pgn-viewer/lib/dist.js\" type=\"text/javascript\" ></script>\n"
    // create the string to be read by the pgn-viewer
    template = library+"<script>\n"+" PGNV."+mode+"('"+id+"', { pgn: '"+cleaned+"' "+config_string+"})"+"\n</script>\n";
    
    //configure <div> wrapping
    token.attrs = [['id', id]];
    //new content will force HTML to launch the PGNV script
    token.content = template;
    
    //this is e.g. what we want to return:
    //   <div id="board"/>
    //   <script>
    //     PGNV.pgnView('board', {pgn: '1. e4 e5', locale: 'fr', width: '200px'});
    //   </script>
    
    //DEBUG
    window.console.log("DEBUG - bbcode text");
    window.console.log($text);
    // return $text . print_r($config2) . $template;  // Uncomment this  line to see parameters displayed


    return false;
 }
 
// md.block.bbcode.ruler.push('pgnv', {
//     tag: 'pgnv',
//         wrap: function(token, tagInfo, content) {
//         window.console.log("DEBUG - bbcode ruler start.");
//         //read value from tagInfo or assign default value
//         const locale         = (tagInfo.attrs['locale'] || 'it_IT').trim();
//         const id             = (tagInfo.attrs['id'] || 'board').trim();
//         const fen            = (tagInfo.attrs['fen'] || null).trim();
//         const position       = (tagInfo.attrs['position'] || 'start').trim();
//         const pieceStyle     = (tagInfo.attrs['pieceStyle'] || 'merida').trim(); // 'wikipedia', 'alpha', 'uscf' (all from chessboardjs), 'case', 'condal', 'maya', 'merida' (my favorite), 'leipzig' (all from ChessTempoViewer), and 'beyer' (from German chess books).
//         const orientat       = (tagInfo.attrs['orientation'] || 'white').trim();
//         const theme          = (tagInfo.attrs['theme'] || 'zeit').trim();
//         const boardsize      = (tagInfo.attrs['boardsize'] || null).trim();
//         const size           = (tagInfo.attrs['size'] || null).trim();
//         const showcoords     = (Boolean(tagInfo.attrs['showcoords']) || true).trim();
//         const layout         = (tagInfo.attrs['layout'] || null).trim();
//         const movesheight    = (tagInfo.attrs['movesheight'] || null).trim();
//         const colormarker    = (tagInfo.attrs['colormarker'] || null).trim();
//         const showresult     = (tagInfo.attrs['showresult'] || false).trim();
//         const coordsinner    = (tagInfo.attrs['coordsinner'] || true).trim();
//         const coordsfactor   = (tagInfo.attrs['coordsfactor'] || 1).trim();
//         const startplay      = (tagInfo.attrs['startplay'] || null).trim();
//         const headers        = (tagInfo.attrs['headers'] || true).trim();
//         const notation       = (tagInfo.attrs['notation'] || null).trim();
//         const notationlayout = (tagInfo.attrs['notationlayout'] || null).trim();
//         const showfen        = (tagInfo.attrs['showfen'] || false).trim();
//         const coordsfontsize = (tagInfo.attrs['coordsfontsize'] || null).trim();
//         const timertime      = (tagInfo.attrs['timertime'] || null).trim();
//         const width          = (tagInfo.attrs['width'] || '200px').trim();
//         const hidemovesbefore= (tagInfo.attrs['hidemovesbefore'] || null).trim();
        
//         if (id === null) {
//             id = "board";
//         }
//         var undef, i, len;
//         var emptyValues = [undef, null, false, 0, '', '0'];
//         for (i = 0, len = emptyValues.length; i < len; i++)
//         {
//             if (fen === emptyValues[i])
//             {
//                 position = fen;
//                 break;
//             }
//         }
        
//         //debug print
//         text = "Parameters: ";
//         text += "ID: "+id;
//         text += " locale: "+locale+" piecestyle: "+piecestyle+" orientation: "+orientat;
//         text += " theme: "+theme+" boardsize: "+boardsize+" width: "+size+" position: "+position;
//         text += " showCoords: "+showcoords+" layout: "+layout+" movesheight: "+movesheight;
//         text += " colormarker: "+colormarker+" showresult: "+showresult+" coordsinner: "+coordsinner;
//         text += " coordsfactor: "+coordsfactor+" startplay: "+startplay+" headers: "+headers;
//         text += " showresult: "+showresult+" notation: "+notation+" notationLayout: "+notationlayout;
//         text += " showfen: "+showfen+" coordsfontsize: "+coordsfontsize+" timertime: "+timertime;
//         text += " hideMovesBefore: "+hidemovesbefore;
//         // config2 = array_filter({"locale":locale,"pieceStyle":piecestyle,"orientation":orientation,"theme":theme,"boardSize":boardsize,"width":size,"position":position,"showCoords":showcoords,"layout":layout,"movesHeight":movesheight,"colorMarker":colormarker,"showResult":showresult,"coordsInner":coordsinner,"coordsFactor":coordsfactor,"startPlay":startplay,"headers":headers,"showResult":showresult,"notation":notation,"notationLayout":notationlayout,"showFen":showfen,"coordsFontSize":coordsfontsize,"timerTime":timertime,"hideMovesBefore":hidemovesbefore});
        
        
        
//         config2 = removeEmptyValues({"locale":locale,"pieceStyle":pieceStyle,"orientation":orientat,"theme":theme,"boardSize":boardsize,"width":size,"position":position,"showCoords":showcoords,"layout":layout,"movesHeight":movesheight,"colorMarker":colormarker,"showResult":showresult,"coordsInner":coordsinner,"coordsFactor":coordsfactor,"startPlay":startplay,"headers":headers,"showResult":showresult,"notation":notation,"notationLayout":notationlayout,"showFen":showfen,"coordsFontSize":coordsfontsize,"timerTime":timertime,"width":width,"hideMovesBefore":hidemovesbefore});
//         non_string = {0:"headers",1:"showCoords",2:"coordsInner",3:"showFen",4:"hideMovesBefore",5:"showResult",6:"coordsFactor",7:"timerTime",8:"coordsFontSize"};
//         config_string = "";
//         for(var key in config2) {
//             value = config2[key];
//             config_string += ", "+key+": ";
//             if (in_array(key, non_string)) {
//                 config_string += value;
//             } else {
//                 config_string += "'"+value+"'";
//             }
//         }
        
//         // the content is the actual gameplay as notification, to be formatted properly 
//         cleaned = cleanup_pgnv(content);
//         // add the pgn-viewer library
//         library = "<script src=\"../lib/@mliebelt/pgn-viewer/lib/dist.js\" type=\"text/javascript\" ></script>\n"
//         // create the string to be read by the pgn-viewer
//         template = library+"<script>\n"+" PGNV."+mode+"('"+id+"', { pgn: '"+cleaned+"' "+config_string+"})"+"\n</script>\n";
        
//         //configure <div> wrapping
//         token.attrs = [['id', id]];
//         //new content will force HTML to launch the PGNV script
//         token.content = template;
        
//         //this is e.g. what we want to return:
//         //   <div id="board"/>
//         //   <script>
//         //     PGNV.pgnView('board', {pgn: '1. e4 e5', locale: 'fr', width: '200px'});
//         //   </script>
        
//         window.console.log("DEBUG - bbcode text");
//         window.console.log($text);
//         return $text . print_r($config2) . $template;  // Uncomment this  line to see parameters displayed
//         // return true;
        
//     }//,
//     // //close the wrapper
//     // after: function(state) {
//         //     state.push('body_close', 'body', -1);
//         // }
//     });
    
    
    
// Cleanup the content, so it will not have any errors. Known are
// * line breaks ==> Spaces
// * Pattern: ... ==> ..
function cleanup_pgnv(string)
{
    var Settlement = [];
    search = {0:"…",1:"...",2:"…",3:'”',4:'“',5:'„'};
    replace = {0:"...",1:"...",2:"...",3:'"',4:'"',5:'"'};
    tmp = Settlement.str_replace(search, replace, string);
    tmp = Settlement.str_replace({0:"\r\n",1:"\n",2:"\r",3:"<br />",4:"<br>",5:"<p>",6:"</p>",7:" "}, ' ', tmp);
    // tmp = trim(tmp, " \t\n\r");
    tmp = tmp.trim();
    tmp = Settlement.preg_replace('~\\xc2\\xa0~', ' ', tmp);
    return Settlement.preg_replace('/\\s+/', ' ', tmp);
}

function removeEmptyValues(object) {
    for (var key in object) {
        if (object.hasOwnProperty(key)) {
            var value = object[key];
            if (value === null || value === undefined || value === '') {
                delete object[key];
            }
        }
    }
}

function in_array (needle, haystack)
{
	var key = '';
    for (key in haystack)
    {
        if (haystack[key] == needle)
        {
            return true;
        }
    }
	return false;
}
