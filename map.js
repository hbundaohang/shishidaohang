/**
 * 校园导航系统 - 静态版 (GitHub Pages 适配)
 * 使用高德地图底图（GCJ-02 坐标系，需要将GPS的WGS-84坐标转换）
 * 
 * 改动点：
 * - 数据内嵌，无需后端API
 * - Dijkstra算法纯JS实现
 * - 所有资源使用相对路径
 * - 完整的HTTPS地理定位支持
 */

// ==================== 校园数据（从buildings.json内嵌） ====================
const CAMPUS_DATA = {
  "buildings": [
    {"id":1,"name":"图书馆","aliases":["图","library","Lib","图书馆"],"coordinates":[117.959,40.8925],"description":"河北民族师范学院-图书馆","info":"开放时间：8:00-22:00","image":"./images/图书馆.jpg","type":"building"},
    {"id":2,"name":"正门","aliases":["大门","北门","正门"],"coordinates":[117.9594,40.8957],"description":"河北民族师范学院-西门（正门）","info":"河北民族师范学院大门","type":"building"},
    {"id":40,"name":"西北门（侧门）","aliases":["小门","西北门","侧门"],"coordinates":[117.9557,40.8958],"description":"河北民族师范学院-北门（侧门）","info":"河北民族师范学院侧门","type":"building"},
    {"id":41,"name":"东门（侧门）","aliases":["小门","东门","侧门"],"coordinates":[117.9639,40.8917],"description":"河北民族师范学院-东门（小门）","info":"河北民族师范学院侧门","type":"building"},
    {"id":42,"name":"南门（侧门）","aliases":["小门","南门","侧门"],"coordinates":[117.9547,40.8908],"description":"河北民族师范学院-南门（侧门）","info":"河北民族师范学院侧门","type":"building"},
    {"id":3,"name":"第一食堂","aliases":["一食","食堂","canteen"],"coordinates":[117.9567,40.8919],"description":"学生第一食堂（老食堂）","info":"供应时间：6:30-21:30","image":"./images/第一食堂.jpg","type":"building"},
    {"id":4,"name":"体育馆","aliases":["体","体育","gym","运动中心"],"coordinates":[117.9544,40.8932],"description":"综合体育馆","info":"开放时间：周一至周六8:00-22:00","image":"./images/体育馆.jpg","type":"building"},
    {"id":5,"name":"行政楼","aliases":["行","办公楼","行政楼"],"coordinates":[117.9573,40.8954],"description":"河北民族师范学院-行政楼","info":"办公时间：8:00-17:30","image":"./images/行政楼.jpg","type":"building"},
    {"id":6,"name":"修德楼","aliases":["文科楼","修德楼","修德"],"coordinates":[117.9584,40.8938],"description":"河北民族师范学院修德楼","info":"开放时间：8:00-21:30","image":"./images/修德楼.jpg","type":"building"},
    {"id":7,"name":"励能楼","aliases":["理科楼","励能楼","励能"],"coordinates":[117.9595,40.8938],"description":"河北民族师范学院励能楼","image":"./images/砺能楼.jpg","info":"开放时间：8:00-21:30","type":"building"},
    {"id":8,"name":"校医院","aliases":["医院","卫生所","校医"],"coordinates":[117.9589,40.8899],"description":"后勤楼二楼","info":"开放时间：8:00-17:30","type":"building"},
    {"id":9,"name":"美术与设计学院","aliases":["美院","设计院","美术与设计学院","art"],"coordinates":[117.956,40.8933],"description":"美术与设计学院","info":"开放时间：8:00-21:30","image":"./images/美术与设计学院.jpg","type":"building"},
    {"id":10,"name":"产教楼","aliases":["产教","产","产教楼"],"image":"./images/产教楼.jpg","coordinates":[117.9632,40.8920],"description":"产教融合大楼","info":"开放时间：8:00-22:00","type":"building"},
    {"id":11,"name":"致远楼A座","aliases":["致远","A","致远楼A座","实验楼"],"coordinates":[117.961,40.8935],"description":"实训楼A（致远楼A）","info":"开放时间：8:00-22:00","image":"./images/致远楼.jpg","type":"building"},
    {"id":12,"name":"致远楼B座","aliases":["致远","B","致远楼B座","实验楼"],"coordinates":[117.9617,40.893],"description":"实训楼B（致远楼B）","info":"开放时间：8:00-22:00","image":"./images/致远楼.jpg","type":"building"},
    {"id":13,"name":"公共教学楼","aliases":["博学","公教","公教楼"],"coordinates":[117.9599,40.8925],"description":"公教楼（博学楼）","info":"开放时间：8:00-22:00","image":"./images/公共教学楼.jpg","type":"building"},
    {"id":14,"name":"音乐舞蹈学院","aliases":["音乐","舞蹈","舞院"],"coordinates":[117.9612,40.8915],"description":"音乐舞蹈学院","info":"开放时间：8:00-22:00","image":"./images/音乐舞蹈学院.jpg","type":"building"},
    {"id":15,"name":"第二食堂","aliases":["二食","食堂","canteen"],"coordinates":[117.9589,40.8908],"description":"学生第二食堂（新食堂）","info":"供应时间：6:30-21:30","image":"./images/第二食堂.jpg","type":"building"},
    {"id":16,"name":"会议服务中心","aliases":["会议","服务","会议服务中心"],"coordinates":[117.9596,40.8898],"description":"会议服务中心","info":"开放时间：8:00-22:00","type":"building"},
    {"id":17,"name":"体育场","aliases":["操场","运动","体育"],"coordinates":[117.9548,40.8946],"description":"河北民族师范学院体育场","info":"开放时间：8:00-22:00","image":"./images/操场.jpg","type":"building"},
    {"id":18,"name":"乒乓球馆","aliases":["乒乓","球馆","乒乓球馆"],"coordinates":[117.9542,40.8955],"description":"乒乓球馆（操场负一楼）","info":"开放时间：8:00-22:00","image":"./images/图书馆.jpg","type":"building"},
    {"id":19,"name":"排球场地","aliases":["排球","球场","排球场地"],"coordinates":[117.9542,40.8936],"description":"排球场地","info":"开放时间：8:00-22:00","image":"./images/图书馆.jpg","type":"building"},
    {"id":20,"name":"篮球场地","aliases":["篮球","球场","篮球场地"],"coordinates":[117.9542,40.8941],"description":"篮球场地","info":"开放时间：8:00-22:00","image":"./images/图书馆.jpg","type":"building"},
    {"id":34,"name":"网球场地","aliases":["网球","球场","网球场地"],"coordinates":[117.9537,40.8945],"description":"网球场地","info":"开放时间：8:00-22:00","image":"./images/图书馆.jpg","type":"building"},
    {"id":35,"name":"羽毛球场地","aliases":["羽毛球","球场","羽毛球场地"],"coordinates":[117.9537,40.8948],"description":"羽毛球场地","info":"开放时间：8:00-22:00","image":"./images/图书馆.jpg","type":"building"},
    {"id":21,"name":"一号楼","aliases":["一号","宿舍楼","一号楼"],"coordinates":[117.9555,40.8922],"description":"一号宿舍楼","info":"开放时间：6:00-22:30","image":"./images/宿舍楼.jpg","type":"building"},
    {"id":22,"name":"二号楼","aliases":["二号","宿舍楼","二号楼"],"coordinates":[117.9555,40.8919],"description":"二号宿舍楼","info":"开放时间：6:00-22:30","image":"./images/宿舍楼.jpg","type":"building"},
    {"id":23,"name":"三号楼","aliases":["三号","宿舍楼","三号楼"],"coordinates":[117.9555,40.8913],"description":"三号宿舍楼","info":"开放时间：6:00-22:30","image":"./images/宿舍楼.jpg","type":"building"},
    {"id":24,"name":"四号楼","aliases":["四号","宿舍楼","四号楼"],"coordinates":[117.9555,40.891],"description":"四号宿舍楼","info":"开放时间：6:00-22:30","image":"./images/宿舍楼.jpg","type":"building"},
    {"id":25,"name":"五号楼","aliases":["五号","宿舍楼","五号楼"],"coordinates":[117.9567,40.8906],"description":"五号宿舍楼","info":"开放时间：6:00-22:30","image":"./images/宿舍楼.jpg","type":"building"},
    {"id":26,"name":"六号楼","aliases":["六号","宿舍楼","六号楼"],"coordinates":[117.9567,40.8902],"description":"六号宿舍楼","info":"开放时间：6:00-22:30","image":"./images/宿舍楼.jpg","type":"building"},
    {"id":27,"name":"七号楼","aliases":["七号","宿舍楼","七号楼"],"coordinates":[117.9579,40.8914],"description":"七号宿舍楼","info":"开放时间：6:00-22:30","image":"./images/宿舍楼.jpg","type":"building"},
    {"id":28,"name":"八号楼","aliases":["八号","宿舍楼","八号楼"],"coordinates":[117.9579,40.8909],"description":"八号宿舍楼","info":"开放时间：6:00-22:30","image":"./images/宿舍楼.jpg","type":"building"},
    {"id":29,"name":"九号楼","aliases":["九号","宿舍楼","九号楼"],"coordinates":[117.9579,40.8905],"描述":"九号宿舍楼","info":"开放时间：6:00-22:30","image":"./images/宿舍楼.jpg","type":"building"},
    {"id":30,"name":"十号楼","aliases":["十号","宿舍楼","十号楼"],"coordinates":[117.9579,40.8901],"description":"十号宿舍楼","info":"开放时间：6:00-22:30","image":"./images/宿舍楼.jpg","type":"building"},
    {"id":31,"name":"十一号楼","aliases":["十一号","宿舍楼","十一号楼"],"coordinates":[117.9599,40.8905],"description":"十一号宿舍楼","info":"开放时间：6:00-22:30","image":"./images/宿舍楼.jpg","type":"building"},
    {"id":32,"name":"十二号楼","aliases":["十二号","宿舍楼","十二号楼","继续教育学院"],"coordinates":[117.96,40.8903],"description":"十二号宿舍楼（继续教育学院在二楼）","info":"开放时间：6:00-22:30","image":"./images/宿舍楼.jpg","type":"building"},
    {"id":33,"name":"十三号楼","aliases":["十三号","宿舍楼","十三号楼"],"coordinates":[117.958,40.8898],"description":"十三号宿舍楼","info":"开放时间：6:00-22:30","image":"./images/宿舍楼.jpg","type":"building"},
    {"id":45,"name":"快递站","aliases":["快递","快递站"],"coordinates":[117.9593,40.8894],"description":"快递站","info":"营业时间：8:00-19:00","image":"./images/快递站.jpg","type":"building"}
  ],
  "intersections": [
    {"id":101,"name":"正门","coordinates":[117.959,40.8945],"type":"intersection"},
    {"id":102,"name":"行政楼门口","coordinates":[117.9573,40.8945],"type":"intersection"},
    {"id":140,"name":"西北门（侧门）路口","coordinates":[117.9557,40.8945],"type":"intersection"},
    {"id":134,"name":"网球场路口","coordinates":[117.9539,40.8944],"type":"intersection"},
    {"id":117,"name":"操场路口","coordinates":[117.9553,40.8942],"type":"intersection"},
    {"id":120,"name":"篮球场门口","coordinates":[117.9548,40.8939],"type":"intersection"},
    {"id":104,"name":"体育馆门口","coordinates":[117.9547,40.8932],"type":"intersection"},
    {"id":109,"name":"美术与设计学院","coordinates":[117.9556,40.8933],"type":"intersection"},
    {"id":121,"name":"一号楼东北角","coordinates":[117.956,40.8925],"type":"intersection"},
    {"id":122,"name":"二号楼东南角","coordinates":[117.956,40.8916],"type":"intersection"},
    {"id":200,"name":"一号楼西北角","coordinates":[117.9547,40.8925],"type":"intersection"},
    {"id":201,"name":"二号楼西南角","coordinates":[117.9547,40.8917],"type":"intersection"},
    {"id":124,"name":"四号楼东南角","coordinates":[117.9561,40.8908],"type":"intersection"},
    {"id":125,"name":"五号楼东北角","coordinates":[117.9573,40.8908],"type":"intersection"},
    {"id":126,"name":"六号楼东南角","coordinates":[117.9573,40.8899],"type":"intersection"},
    {"id":202,"name":"南门口","coordinates":[117.9547,40.8908],"type":"intersection"},
    {"id":242,"name":"四号楼南方向","coordinates":[117.9555,40.8901],"type":"intersection"},
    {"id":205,"name":"六号楼西南角","coordinates":[117.9562,40.8899],"type":"intersection"},
    {"id":206,"name":"十三号楼西南角","coordinates":[117.9572,40.8896],"type":"intersection"},
    {"id":233,"name":"十三号楼东北角","coordinates":[117.9583,40.8899],"type":"intersection"},
    {"id":243,"name":"十三号楼东南角","coordinates":[117.9584,40.8896],"type":"intersection"},
    {"id":228,"name":"八号楼东南角","coordinates":[117.9584,40.8908],"type":"intersection"},
    {"id":227,"name":"七号楼东北角","coordinates":[117.9584,40.8916],"type":"intersection"},
    {"id":250,"name":"七号楼西北角","coordinates":[117.9573,40.8916],"type":"intersection"},
    {"id":251,"name":"第一食堂","coordinates":[117.957,40.8916],"type":"intersection"},
    {"id":252,"name":"第一食堂","coordinates":[117.9573,40.8919],"type":"intersection"},
    {"id":253,"name":"食堂东北角","coordinates":[117.9573,40.8925],"type":"intersection"},
    {"id":254,"name":"美术与设计学院东","coordinates":[117.9573,40.8932],"type":"intersection"},
    {"id":255,"name":"修德楼东南角","coordinates":[117.9587,40.8932],"type":"intersection"},
    {"id":256,"name":"修德楼东北角","coordinates":[117.9587,40.8944],"type":"intersection"},
    {"id":257,"name":"励能楼西北角","coordinates":[117.9593,40.8944],"type":"intersection"},
    {"id":258,"name":"励能楼西南角","coordinates":[117.9593,40.8932],"type":"intersection"},
    {"id":259,"name":"励能楼门口","coordinates":[117.9593,40.8937],"type":"intersection"},
    {"id":260,"name":"修德楼门口","coordinates":[117.9587,40.8937],"type":"intersection"},
    {"id":261,"name":"创业楼西北角","coordinates":[117.9584,40.8901],"type":"intersection"},
    {"id":262,"name":"创业楼东北角","coordinates":[117.9595,40.8901],"type":"intersection"},
    {"id":263,"name":"创业东南角","coordinates":[117.9595,40.8896],"type":"intersection"},
    {"id":264,"name":"1112楼中间","coordinates":[117.9595,40.8904],"type":"intersection"},
    {"id":265,"name":"新食堂西南角","coordinates":[117.9584,40.8904],"type":"intersection"},
    {"id":266,"name":"十一楼东南角","coordinates":[117.9605,40.8904],"type":"intersection"},
    {"id":267,"name":"十一楼西北角","coordinates":[117.9595,40.8907],"type":"intersection"},
    {"id":268,"name":"新食堂东北","coordinates":[117.9595,40.8916],"type":"intersection"},
    {"id":269,"name":"公教楼西北角","coordinates":[117.9598,40.8932],"type":"intersection"},
    {"id":270,"name":"公教楼门口","coordinates":[117.9598,40.8925],"type":"intersection"},
    {"id":271,"name":"公教楼西南角","coordinates":[117.9598,40.8916],"type":"intersection"},
    {"id":272,"name":"公教楼东北角","coordinates":[117.9611,40.8932],"type":"intersection"},
    {"id":273,"name":"励能楼东南角","coordinates":[117.9606,40.8932],"type":"intersection"},
    {"id":274,"name":"励能楼东北角","coordinates":[117.9606,40.8944],"type":"intersection"},
    {"id":275,"name":"美术与设计学院南","coordinates":[117.956,40.893],"type":"intersection"},
    {"id":276,"name":"美术与设计学院","coordinates":[117.9564,40.8932],"type":"intersection"},
    {"id":277,"name":"十一楼东北角","coordinates":[117.9605,40.8907],"type":"intersection"},
    {"id":278,"name":"十一北方","coordinates":[117.9603,40.8907],"type":"intersection"},
    {"id":279,"name":"公教楼南方","coordinates":[117.9603,40.8916],"type":"intersection"},
    {"id":280,"name":"音乐舞蹈学院门口","coordinates":[117.9611,40.8916],"type":"intersection"},
    {"id":281,"name":"公共教学楼后门","coordinates":[117.9611,40.8925],"type":"intersection"},
    {"id":282,"name":"产教西方","coordinates":[117.9622,40.8925],"type":"intersection"},
    {"id":283,"name":"产教西南角","coordinates":[117.9622,40.8918],"type":"intersection"},
    {"id":284,"name":"产教西北角","coordinates":[117.9621,40.8933],"type":"intersection"},
    {"id":285,"name":"产教东北角","coordinates":[117.9638,40.8924],"type":"intersection"},
    {"id":286,"name":"产教东南角","coordinates":[117.9638,40.8918],"type":"intersection"},
    {"id":287,"name":"音乐学院东北角","coordinates":[117.9622,40.8916],"type":"intersection"}
  ],
  "roads": [
    {"from":101,"to":256,"distance":30},{"from":256,"to":102,"distance":115},{"from":102,"to":140,"distance":145},
    {"from":140,"to":117,"distance":45},{"from":117,"to":120,"distance":50},{"from":120,"to":104,"distance":75},
    {"from":140,"to":134,"distance":150},{"from":104,"to":109,"distance":75},{"from":109,"to":275,"distance":50},
    {"from":275,"to":276,"distance":35},{"from":276,"to":254,"distance":80},{"from":254,"to":255,"distance":118},{"from":122,"to":124,"distance":90},
    {"from":104,"to":200,"distance":80},{"from":104,"to":121,"distance":150},{"from":200,"to":121,"distance":115},
    {"from":275,"to":121,"distance":60},{"from":200,"to":201,"distance":95},{"from":201,"to":122,"distance":120},
    {"from":201,"to":202,"distance":120},{"from":202,"to":242,"distance":100},{"from":121,"to":122,"distance":95},
    {"from":121,"to":253,"distance":100},{"from":253,"to":254,"distance":90},{"from":253,"to":252,"distance":65},
    {"from":252,"to":251,"distance":40},{"from":251,"to":250,"distance":25},{"from":252,"to":250,"distance":25},
    {"from":122,"to":251,"distance":75},{"from":252,"to":255,"distance":200},{"from":256,"to":260,"distance":80},
    {"from":260,"to":255,"distance":65},{"from":101,"to":257,"distance":30},{"from":257,"to":259,"distance":70},
    {"from":259,"to":258,"distance":60},{"from":258,"to":269,"distance":30},{"from":255,"to":258,"distance":60},
    {"from":269,"to":270,"distance":85},{"from":270,"to":271,"distance":90},{"from":268,"to":271,"distance":25},
    {"from":250,"to":227,"distance":100},{"from":227,"to":228,"distance":90},{"from":227,"to":268,"distance":90},
    {"from":125,"to":228,"distance":100},{"from":228,"to":265,"distance":50},{"from":265,"to":261,"distance":50},
    {"from":261,"to":233,"distance":15},{"from":126,"to":233,"distance":100},{"from":233,"to":243,"distance":30},
    {"from":206,"to":243,"distance":100},{"from":261,"to":262,"distance":85},{"from":243,"to":263,"distance":80},
    {"from":262,"to":263,"distance":50},{"from":264,"to":262,"distance":35},{"from":264,"to":267,"distance":40},
    {"from":267,"to":268,"distance":105},{"from":251,"to":124,"distance":115},{"from":271,"to":279,"distance":50},
    {"from":279,"to":278,"distance":105},{"from":242,"to":124,"distance":70},{"from":279,"to":280,"distance":70},
    {"from":267,"to":278,"distance":80},{"from":250,"to":125,"distance":90},{"from":278,"to":277,"distance":15},
    {"from":277,"to":266,"distance":40},{"from":264,"to":266,"distance":95},{"from":125,"to":124,"distance":100},
    {"from":125,"to":126,"distance":90},{"from":205,"to":126,"distance":80},{"from":205,"to":242,"distance":60},
    {"from":206,"to":126,"distance":40},{"from":206,"to":205,"distance":100},{"from":264,"to":265,"distance":90},
    {"from":280,"to":281,"distance":95},{"from":272,"to":281,"distance":80},{"from":272,"to":273,"distance":40},
    {"from":269,"to":273,"distance":70},{"from":273,"to":274,"distance":140},{"from":257,"to":274,"distance":100},
    {"from":287,"to":280,"distance":90},{"from":287,"to":283,"distance":15},{"from":281,"to":282,"distance":100},
    {"from":283,"to":282,"distance":95},{"from":282,"to":284,"distance":75},{"from":284,"to":274,"distance":200},
    {"from":283,"to":286,"distance":140},{"from":285,"to":286,"distance":90},{"from":257,"to":274,"distance":100},
    {"from":284,"to":285,"distance":160}
  ],
  "building_connections": [
    {"building":1,"intersection":255,"distance":80},{"building":2,"intersection":101,"distance":100},
    {"building":3,"intersection":251,"distance":50},{"building":4,"intersection":104,"distance":40},
    {"building":5,"intersection":102,"distance":100},{"building":6,"intersection":260,"distance":10},
    {"building":7,"intersection":259,"distance":10},{"building":8,"intersection":263,"distance":50},
    {"building":9,"intersection":109,"distance":0},{"building":10,"intersection":286,"distance":80},
    {"building":11,"intersection":272,"distance":40},{"building":12,"intersection":272,"distance":40},
    {"building":13,"intersection":270,"distance":10},{"building":14,"intersection":280,"distance":50},
    {"building":16,"intersection":262,"distance":40},{"building":15,"intersection":267,"distance":40},
    {"building":18,"intersection":134,"distance":125},{"building":17,"intersection":117,"distance":40},
    {"building":20,"intersection":120,"distance":25},{"building":19,"intersection":104,"distance":40},
    {"building":21,"intersection":121,"distance":40},{"building":22,"intersection":122,"distance":30},
    {"building":23,"intersection":122,"distance":50},{"building":24,"intersection":124,"distance":50},
    {"building":25,"intersection":125,"distance":60},{"building":26,"intersection":126,"distance":40},
    {"building":35,"intersection":134,"distance":15},{"building":30,"intersection":126,"distance":35},
    {"building":29,"intersection":125,"distance":50},{"building":28,"intersection":228,"distance":40},
    {"building":27,"intersection":227,"distance":50},{"building":31,"intersection":264,"distance":35},
    {"building":32,"intersection":264,"distance":35},{"building":33,"intersection":233,"distance":35},
    {"building":40,"intersection":140,"distance":150},{"building":34,"intersection":134,"distance":10},
    {"building":45,"intersection":263,"distance":10},{"building":41,"intersection":286,"distance":10},
    {"building":42,"intersection":202,"distance":0}
  ]
};

// ==================== 导航引擎（纯JavaScript实现Dijkstra算法） ====================
class CampusNavigator {
    constructor(data) {
        this.data = data;
        this.nodes = {};
        this.nodeType = {};
        this.aliasIndex = {};
        this.graph = {};
        this._init();
    }

    _init() {
        // 添加建筑节点
        for (const b of this.data.buildings) {
            this.nodes[b.id] = {
                id: b.id,
                name: b.name,
                coordinates: b.coordinates,
                type: 'building',
                description: b.description || '',
                info: b.info || '',
                image: b.image || '',
                aliases: b.aliases || []
            };
            this.nodeType[b.id] = 'building';
        }
        // 添加路口节点
        for (const i of (this.data.intersections || [])) {
            this.nodes[i.id] = { id: i.id, name: i.name, coordinates: i.coordinates, type: 'intersection' };
            this.nodeType[i.id] = 'intersection';
        }
        // 构建别名索引
        for (const b of this.data.buildings) {
            this.aliasIndex[b.name.toLowerCase()] = b.id;
            for (const alias of (b.aliases || [])) {
                this.aliasIndex[alias.toLowerCase()] = b.id;
            }
        }
        // 构建图结构
        for (const nodeId in this.nodes) {
            this.graph[nodeId] = [];
        }
        for (const road of (this.data.roads || [])) {
            this.graph[road.from].push([road.to, road.distance]);
            this.graph[road.to].push([road.from, road.distance]);
        }
        for (const conn of (this.data.building_connections || [])) {
            this.graph[conn.building].push([conn.intersection, conn.distance]);
            this.graph[conn.intersection].push([conn.building, conn.distance]);
        }
        console.log(`导航引擎初始化完成: ${this.data.buildings.length}个建筑, ${(this.data.intersections||[]).length}个路口`);
    }

    searchBuilding(query) {
        if (!query) return [null, null];
        const q = query.toLowerCase().trim();
        if (this.aliasIndex[q]) {
            const bid = this.aliasIndex[q];
            return [bid, this.nodes[bid]];
        }
        for (const [name, bid] of Object.entries(this.aliasIndex)) {
            if (q.includes(name) || name.includes(q)) {
                return [bid, this.nodes[bid]];
            }
        }
        return [null, null];
    }

    findShortestPath(startId, endId) {
        if (!(startId in this.nodes)) return { success: false, error: `无效起点ID: ${startId}` };
        if (!(endId in this.nodes)) return { success: false, error: `无效终点ID: ${endId}` };
        if (startId === endId) {
            return { success: true, path: [startId], distance: 0, walkTime: 0, pathNames: [this.nodes[startId].name] };
        }

        const distances = {};
        const previous = {};
        const visited = new Set();
        const pq = [];

        for (const id in this.nodes) distances[id] = Infinity;
        distances[startId] = 0;
        pq.push([0, startId]);

        while (pq.length > 0) {
            pq.sort((a, b) => a[0] - b[0]);
            const [currentDist, current] = pq.shift();
            if (visited.has(current)) continue;
            visited.add(current);
            if (current === endId) break;

            for (const [neighbor, weight] of this.graph[current]) {
                if (visited.has(neighbor)) continue;
                const newDist = currentDist + weight;
                if (newDist < distances[neighbor]) {
                    distances[neighbor] = newDist;
                    previous[neighbor] = current;
                    pq.push([newDist, neighbor]);
                }
            }
        }

        if (distances[endId] === Infinity) {
            return { success: false, error: '起点和终点之间没有路径' };
        }

        let pathIds = [];
        let cur = endId;
        while (cur !== undefined) {
            pathIds.push(cur);
            cur = previous[cur];
        }
        pathIds.reverse();

        const pathNames = pathIds.map(id => this.nodes[id].name);
        const walkTime = Math.round(distances[endId] / 80 * 10) / 10;

        return {
            success: true,
            path: pathIds,
            distance: Math.round(distances[endId]),
            walkTime,
            pathNames
        };
    }

    findNearestNode(lat, lng) {
        let minDist = Infinity;
        let nearestId = null;
        for (const [id, node] of Object.entries(this.nodes)) {
            const d = Math.sqrt(
                ((lat - node.coordinates[1]) * 111000) ** 2 +
                ((lng - node.coordinates[0]) * 85000) ** 2
            );
            if (d < minDist) { minDist = d; nearestId = parseInt(id); }
        }
        return nearestId ? { id: nearestId, node: this.nodes[nearestId], distance: minDist } : null;
    }

    navigateFromGPS(lat, lng, endQuery) {
        const [endId, endNode] = this.searchBuilding(endQuery);
        if (!endId || !endNode) return { success: false, error: `找不到终点: ${endQuery}` };

        const nearest = this.findNearestNode(lat, lng);
        if (!nearest) return { success: false, error: '无法找到有效路径起点' };

        const result = this.findShortestPath(nearest.id, endId);
        if (!result.success) return result;

        // 计算GPS点到第一个节点的距离
        const firstNode = this.nodes[result.path[0]];
        const gpsToFirst = Math.round(Math.sqrt(
            ((lat - firstNode.coordinates[1]) * 111000) ** 2 +
            ((lng - firstNode.coordinates[0]) * 85000) ** 2
        ));

        const totalDistance = result.distance + gpsToFirst;

        return {
            success: true,
            start: { name: '当前位置', lat, lng },
            end: { id: endId, name: endNode.name, lat: endNode.coordinates[1], lng: endNode.coordinates[0] },
            distance: totalDistance,
            walkTime: Math.round(totalDistance / 80 * 10) / 10,
            pathNames: ['当前位置'].concat(result.pathNames),
            pathCoordinates: [{ node_id: 'gps_start', name: '当前位置', lat, lng, type: 'gps' }].concat(
                result.path.map(id => ({
                    node_id: id, name: this.nodes[id].name,
                    lat: this.nodes[id].coordinates[1],
                    lng: this.nodes[id].coordinates[0],
                    type: this.nodes[id].type
                }))
            )
        };
    }
}

// 全局导航实例
let campusNavigator = null;


// ==================== 坐标系转换（WGS-84 → GCJ-02） ====================
function wgs84ToGcj02(lat, lng) {
    const PI = Math.PI;
    const a = 6378245.0;
    const ee = 0.00669342162296594323;

    function transformLat(x, y) {
        let ret = -100.0 + 2.0*x + 3.0*y + 0.2*y*y + 0.1*x*y + 0.2*Math.sqrt(Math.abs(x));
        ret += (20.0*Math.sin(6.0*x*PI)+20.0*Math.sin(2.0*x*PI))*2.0/3.0;
        ret += (20.0*Math.sin(y*PI)+40.0*Math.sin(y/3.0*PI))*2.0/3.0;
        ret += (160.0*Math.sin(y/12.0*PI)+320.0*Math.sin(y*PI/30.0))*2.0/3.0;
        return ret;
    }

    function transformLng(x, y) {
        let ret = 300.0+x+2.0*y+0.1*x*x+0.1*x*y+0.2*Math.sqrt(Math.abs(x));
        ret += (20.0*Math.sin(6.0*x*PI)+20.0*Math.sin(2.0*x*PI))*2.0/3.0;
        ret += (20.0*Math.sin(x*PI)+40.0*Math.sin(x/3.0*PI))*2.0/3.0;
        ret += (150.0*Math.sin(x/12.0*PI)+300.0*Math.sin(x/30.0*PI))*2.0/3.0;
        return ret;
    }

    let dLat = transformLat(lng - 105.0, lat - 35.0);
    let dLng = transformLng(lng - 105.0, lat - 35.0);
    const radLat = lat / 180.0 * PI;
    let magic = Math.sin(radLat);
    magic = 1 - ee * magic * magic;
    const sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180.0) / ((a*(1-ee))/(magic*sqrtMagic)*PI);
    dLng = (dLng * 180.0) / (a/sqrtMagic*Math.cos(radLat)*PI);

    return { lat: lat + dLat, lng: lng + dLng };
}

// ==================== 全局变量 ====================
let map;
let markers = [];
let currentPathLayer = null;
let buildingsData = [];
let currentStartMarker = null;
let currentEndMarker = null;
let userLocationMarker = null;
let userAccuracyCircle = null;
let isMobile = window.innerWidth <= 767;

const MAP_CENTER = [40.8925, 117.9590];
const MAP_ZOOM = 16;

let currentStart = null;
let currentEnd = null;
let compassBtn = null;

// 实时定位导航模块
let locationWatchId = null;
let isRealTimeNavigating = false;
let navigationPath = null;
let navigationDestination = '';
let currentPathIndex = 0;
let lastPosition = null;
let positionHistory = [];
let locationPermissionStatus = 'prompt';
let isFollowingUser = false;
let lastGPSUpdateTime = 0;
let gpsWatchdogTimer = null;

// 导航增强变量
let totalDistanceTraveled = 0;          // 累计行走距离
let navigationStartTime = 0;            // 导航开始时间戳
let lastNavUpdateTime = 0;              // 上次导航面板更新时间
let smoothedSpeed = 0;                  // 平滑后的速度
let gpsQualityLevel = 'unknown';        // GPS质量等级
let consecutivePoorGPS = 0;             // 连续低质量GPS计数
let navTotalDistance = 0;               // 路线总距离（用于进度%计算）

// 自动重规划相关
let isRerouting = false;
let rerouteCount = 0;
let lastRerouteTime = 0;
const MAX_REROUTE_COUNT = 5;
const REROUTE_DEVIATION_THRESHOLD = 50;
const REROUTE_COOLDOWN_MS = 8000;
let reroutePathBackup = null;

// ==================== 建筑类型样式 ====================
function getBuildingClass(building) {
    const name = building.name;
    if (/图书馆|图/.test(name)) return 'building-library';
    if (/食堂|食/.test(name)) return 'building-canteen';
    if (/体育馆|体/.test(name)) return 'building-gym';
    if (/行政|办公/.test(name)) return 'building-admin';
    if (/医院|卫生/.test(name)) return 'building-hospital';
    if (/会议/.test(name)) return 'building-meeting';
    if (/宿舍|号楼|公寓/.test(name)) return 'building-dorm';
    if (/门/.test(name)) return 'building-door';
    if (/产教/.test(name)) return 'building-business';
    if (/篮球/.test(name)) return 'building-basketball';
    if (/足球|操场|体育/.test(name)) return 'building-soccer';
    if (/网球/.test(name)) return 'building-tennis';
    if (/排球/.test(name)) return 'building-volleyball';
    if (/羽毛球/.test(name)) return 'building-badminton';
    if (/乒乓/.test(name)) return 'building-pingpong';
    if (/致远/.test(name)) return 'building-lab';
    if (/音乐|舞蹈/.test(name)) return 'building-music';
    if (/快递/.test(name)) return 'building-package';
    if (/美术|设计/.test(name)) return 'building-art';
    return 'building-teaching';
}

function getBuildingEmoji(building) {
    const name = building.name;
    if (/图书馆|图/.test(name)) return '📖';
    else if (/食堂|食/.test(name)) return '🍽️';
    else if (/体育馆|体/.test(name)) return '🏋️';
    else if (/行政|办公/.test(name)) return '📋';
    else if (/医院|卫生/.test(name)) return '🏥';
    else if (/会议/.test(name)) return '📋';
    else if (/宿舍|号楼|公寓/.test(name)) return '🛏️';
    else if (/门/.test(name)) return '🚪';
    else if (/产教/.test(name)) return '💻';
    else if (/篮球/.test(name)) return '🏀';
    else if (/足球|操场|体育/.test(name)) return '⚽';
    else if (/网球/.test(name)) return '🎾';
    else if (/排球/.test(name)) return '🏐';
    else if (/羽毛球/.test(name)) return '🏸';
    else if (/乒乓/.test(name)) return '🏓';
    else if (/致远/.test(name)) return '🧪';
    else if (/音乐|舞蹈/.test(name)) return '🎵';
    else if (/快递/.test(name)) return '📦';
    else if (/美术|设计/.test(name)) return '🎨';
    else return '🏢';
}

// ==================== 设备检测 ====================
function detectDevice() {
    isMobile = window.innerWidth <= 767;
    const panel = document.getElementById('control-panel');
    const menuBtn = document.getElementById('menu-btn');
    
    if (window.innerWidth >= 1025) {
        if (panel) {
            panel.classList.add('open');
            panel.style.transform = '';
        }
        if (menuBtn) menuBtn.style.display = 'none';
    } else {
        if (panel) panel.classList.remove('open');
        if (menuBtn) menuBtn.style.display = 'flex';
    }
    
    // 多次触发地图重算以确保全屏
    const refitMap = () => {
        if (map) {
            map.invalidateSize();
            requestAnimationFrame(() => map.invalidateSize());
        }
    };
    refitMap();
    setTimeout(refitMap, 200);
    setTimeout(refitMap, 500);
}

function togglePanel() {
    const panel = document.getElementById('control-panel');
    if (window.innerWidth < 1025 && panel) panel.classList.toggle('open');
}

// ==================== 移动端面板触摸拖拽 ====================
let panelDragState = null;

function initPanelTouchDrag() {
    const panel = document.getElementById('control-panel');
    const handle = document.getElementById('panel-handle');
    if (!panel || !handle || !isMobile) return;

    const startDrag = (e) => {
        if (window.innerWidth >= 1025) return;
        const touch = e.touches ? e.touches[0] : e;
        panelDragState = {
            startY: touch.clientY,
            startTransform: panel.classList.contains('open') ? 0 : parseFloat(getComputedStyle(panel).transform.split(',')[5] || 0),
            isOpen: panel.classList.contains('open'),
            moved: false
        };
        panel.style.transition = 'none';
    };

    const moveDrag = (e) => {
        if (!panelDragState) return;
        const touch = e.touches ? e.touches[0] : e;
        const delta = touch.clientY - panelDragState.startY;
        panelDragState.moved = true;

        // 限制拖拽范围
        const maxTranslate = panel.offsetHeight - 50; // 最多拖到底（只留tab显示）
        let translateY = panelDragState.isOpen ? delta : (maxTranslate + delta);
        translateY = Math.max(0, Math.min(translateY, maxTranslate));
        
        panel.style.transform = `translateY(${translateY}px)`;
        e.preventDefault();
    };

    const endDrag = (e) => {
        if (!panelDragState) return;
        panel.style.transition = 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)';
        
        if (!panelDragState.moved) {
            panel.classList.toggle('open');
            panelDragState = null;
            return;
        }

        const delta = e.changedTouches ? e.changedTouches[0].clientY - panelDragState.startY : 0;
        const threshold = panel.offsetHeight * 0.3;
        
        if (panelDragState.isOpen) {
            if (delta > threshold) panel.classList.remove('open');
            else panel.classList.add('open');
        } else {
            if (-delta > threshold) panel.classList.add('open');
            else panel.classList.remove('open');
        }
        panelDragState = null;
    };

    handle.addEventListener('touchstart', startDrag, { passive: false });
    handle.addEventListener('touchmove', moveDrag, { passive: false });
    handle.addEventListener('touchend', endDrag);
    handle.addEventListener('mousedown', startDrag);
    window.addEventListener('mousemove', moveDrag);
    window.addEventListener('mouseup', endDrag);
}

function resetNorth() {
    if (!map) return;
    map.setView(map.getCenter(), map.getZoom());
    showToast('已重置视图');
}

// ==================== 地图初始化 ====================
function initMap() {
    console.log('初始化地图（静态版 - GitHub Pages适配）...');

    map = L.map('map', {
        center: MAP_CENTER,
        zoom: MAP_ZOOM,
        zoomControl: false,
        fadeAnimation: true,
        zoomAnimation: true
    });

    // 高德地图底图（矢量路网 + 中文标注）
    L.tileLayer('https://webrd0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}', {
        attribution: '&copy; 高德地图',
        maxZoom: 19,
        minZoom: 3,
        subdomains: ['1', '2', '3', '4']
    }).addTo(map);

    L.tileLayer('https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', {
        attribution: '',
        maxZoom: 19,
        minZoom: 3,
        subdomains: ['1', '2', '3', '4']
    }).addTo(map);

    console.log('✅ 高德底图已加载');

    map.setMinZoom(13);
    map.setMaxZoom(19);

    L.control.zoom({ position: 'topright' }).addTo(map);
    L.control.scale({ metric: true, imperial: false, position: 'bottomleft' }).addTo(map);

    window.addEventListener('resize', () => { detectDevice(); if(map) map.invalidateSize(); });

    loadBuildingsFromData();
    loadRoadsFromData();

    if (window.innerWidth >= 1025) {
        document.getElementById('control-panel')?.classList.add('open');
    }

    console.log('地图初始化完成');
}

// ==================== 从内嵌数据加载建筑 ====================
function loadBuildingsFromData() {
    console.log('从内载数据加载建筑...');
    
    buildingsData = CAMPUS_DATA.buildings;
    console.log('加载建筑数据:', buildingsData.length, '个建筑');

    markers.forEach(m => map.removeLayer(m));
    markers = [];

    const isDesktop = window.innerWidth >= 1025;

    buildingsData.forEach((building) => {
        const lat = building.coordinates[1];
        const lng = building.coordinates[0];
        const buildingClass = getBuildingClass(building);

        const buildingIcon = L.divIcon({
            className: 'custom-building-marker',
            html: `<div class="building-rect ${buildingClass}" title="${building.name}"></div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
            popupAnchor: [0, -20]
        });

        const marker = L.marker([lat, lng], {
            icon: buildingIcon,
            title: building.name,
            riseOnHover: true
        }).addTo(map);

        marker.bindTooltip(building.name, {
            permanent: isDesktop, direction: 'top', offset: [0, -20],
            opacity: 0.95, className: 'building-label'
        });

        // 弹窗内容 - 图片使用相对路径
        const imgSrc = building.image || '';
        const buildingImage = imgSrc ?
            `<img src="${imgSrc}" style="width:100%;aspect-ratio:16/10;object-fit:cover;border-radius:8px;margin-bottom:10px;" onerror="this.style.display='none'">` :
            `<div style="width:100%;aspect-ratio:16/10;background:linear-gradient(135deg,#f8f9fa,#e9ecef);border-radius:8px;margin-bottom:10px;display:flex;align-items:center;justify-content:center;font-size:36px;">${getBuildingEmoji(building)}</div>`;

        marker.bindPopup(`
            <div style="min-width:200px;padding:10px;">
                ${buildingImage}
                <strong style="font-size:14px;color:#333;">${building.name}</strong>
                <p style="font-size:12px;margin:8px 0;color:#666;">${building.description || '暂无描述'}</p>
                ${building.info ? `<p style="font-size:11px;color:#999;margin:5px 0;">📌 ${building.info}</p>` : ''}
                <div style="display:flex;gap:8px;margin-top:12px;">
                    <button onclick="setAsStart('${building.name}')" style="flex:1;padding:6px;background:#28a745;color:white;border:none;border-radius:4px;cursor:pointer;font-size:12px;">设为起点</button>
                    <button onclick="setAsEnd('${building.name}')" style="flex:1;padding:6px;background:#dc3545;color:white;border:none;border-radius:4px;cursor:pointer;font-size:12px;">设为终点</button>
                </div>
            </div>
        `);

        markers.push(marker);
    });

    updateBuildingList();
    console.log('建筑标记添加完成');
}

// ==================== 从内嵌数据加载道路 ====================
function loadRoadsFromData() {
    console.log('从内载数据加载道路...');

    const roads = CAMPUS_DATA.roads || [];
    roads.forEach(road => {
        const fromCoord = campusNavigator?.nodes[road.from]?.coordinates || findNodeCoord(road.from);
        const toCoord = campusNavigator?.nodes[road.to]?.coordinates || findNodeCoord(road.to);
        if (!fromCoord || !toCoord) return;

        const fromLatLng = [fromCoord[1], fromCoord[0]];
        const toLatLng = [toCoord[1], toCoord[0]];

        if (road.distance > 200) {
            L.polyline([fromLatLng, toLatLng], { color:'#fff', weight:8, opacity:0.2, lineCap:'round', lineJoin:'round' }).addTo(map);
            L.polyline([fromLatLng, toLatLng], { color:'#f5a623', weight:6, opacity:0.9, lineCap:'round', lineJoin:'round' }).addTo(map);
            L.polyline([fromLatLng, toLatLng], { color:'#ffd700', weight:1.5, opacity:0.7, dashArray:'10,8', lineCap:'round' }).addTo(map);
        } else {
            L.polyline([fromLatLng, toLatLng], { color:'#c0c0c0', weight:4.5, opacity:0.85, lineCap:'round', lineJoin:'round' }).addTo(map);
            L.polyline([fromLatLng, toLatLng], { color:'#e0e0e0', weight:1.5, opacity:0.6, dashArray:'6,6', lineCap:'round' }).addTo(map);
        }

        if (road.distance < 300 && road.distance > 0) {
            const midLat = (fromLatLng[0]+toLatLng[0])/2;
            const midLng = (fromLatLng[1]+toLatLng[1])/2;
            L.circleMarker([midLat,midLng], { radius:3, color:'#888', fillColor:'#fff', fillOpacity:1, weight:1.5 }).addTo(map);
        }
    });

    // 绘制建筑到路口的连接线（蓝色虚线）
    loadBuildingConnections();
    
    loadExternalRoads();
}

function loadBuildingConnections() {
    console.log('绘制建筑-路口连接线...');
    const conns = CAMPUS_DATA.building_connections || [];
    let count = 0;
    conns.forEach(conn => {
        const buildingCoord = findNodeCoord(conn.building);
        const interCoord = findNodeCoord(conn.intersection);
        if (!buildingCoord || !interCoord) return;

        const fromLatlng = [buildingCoord[1], buildingCoord[0]];
        const toLatlng = [interCoord[1], interCoord[0]];

        // 蓝色虚线连接建筑和路口
        L.polyline([fromLatlng, toLatlng], {
            color: '#87CEEB',
            weight: 2,
            opacity: 0.7,
            dashArray: '5,5',
            lineCap: 'round'
        }).addTo(map);
        count++;
    });
    console.log(`连接线绘制完成: ${count} 条`);
}

function findNodeCoord(nodeId) {
    if (campusNavigator && campusNavigator.nodes[nodeId]) return campusNavigator.nodes[nodeId].coordinates;
    for (const b of CAMPUS_DATA.buildings) { if (b.id === nodeId) return b.coordinates; }
    for (const i of (CAMPUS_DATA.intersections||[])) { if (i.id === nodeId) return i.coordinates; }
    return null;
}

function loadExternalRoads() {
    const externalRoadPoints = [
        [40.8922, 117.9649],[40.8966, 117.9581],[40.8957, 117.9567],
        [40.8970, 117.9542],[40.8915, 117.9524],[40.8892, 117.9569],[40.8894, 117.9623]
    ];
    const closedRoadPoints = [...externalRoadPoints, externalRoadPoints[0]];

    L.polyline(closedRoadPoints, { color:'#ffffff', weight:14, opacity:0.4, lineCap:'round', lineJoin:'round' }).addTo(map);
    L.polyline(closedRoadPoints, { color:'#ff8c00', weight:10, opacity:0.9, lineCap:'round', lineJoin:'round' }).addTo(map);

    externalRoadPoints.forEach(point => {
        L.circleMarker(point, { radius:4, color:'#ff8c00', fillColor:'#fff', fillOpacity:1, weight:2 }).addTo(map);
    });
}

// ==================== 更新建筑列表 ====================
function updateBuildingList() {
    const listEl = document.getElementById('building-list');
    if (!listEl) return;

    listEl.innerHTML = '';

    if (buildingsData.length === 0) {
        listEl.innerHTML = '<div style="padding:20px;text-align:center;color:#999;">暂无建筑数据</div>';
        return;
    }

    buildingsData.forEach(building => {
        const item = document.createElement('div');
        item.className = 'building-item';

        item.innerHTML = `
            <div class="building-name">${getBuildingEmoji(building)} ${building.name}</div>
            <div class="building-desc">${building.description || '点击查看详情'}</div>
        `;

        item.onclick = () => {
            map.setView([building.coordinates[1], building.coordinates[0]], 18);
            const marker = markers.find(m => {
                const latlng = m.getLatLng();
                return Math.abs(latlng.lat - building.coordinates[1]) < 0.0001 &&
                       Math.abs(latLng.lng - building.coordinates[0]) < 0.0001;
            });
            if (marker) marker.openPopup();
            if (window.innerWidth <= 1024) {
                switchTab('nav');
                document.getElementById('control-panel')?.classList.remove('open');
            }
        };
        listEl.appendChild(item);
    });
}

// ==================== 起点/终点设置 ====================
function setAsStart(name) {
    const startInput = document.getElementById('start-input');
    if (startInput) startInput.value = name;
    currentStart = name;
    showToast(`已设起点: ${name}`);
    if (currentEnd) navigateLocal();
}

function setAsEnd(name) {
    const endInput = document.getElementById('end-input');
    if (endInput) endInput.value = name;
    currentEnd = name;
    showToast(`已设终点: ${name}`);
    if (currentStart) navigateLocal();
}

// ==================== 定位权限管理（增强版 - HTTPS兼容） ====================

/**
 * 检测浏览器环境并给出定位建议
 */
function checkLocationEnvironment() {
    const issues = [];

    // 1. 检查是否支持Geolocation
    if (!navigator.geolocation) {
        return { supported: false, reason: '浏览器不支持Geolocation API' };
    }

    // 2. 检查安全上下文（HTTPS是必须的，localhost例外）
    if (window.isSecureContext === false) {
        const isLocalhost = /localhost|127\.0\.0\.1|::1|\[::1\]/i.test(window.location.hostname);
        if (!isLocalhost) {
            issues.push('非HTTPS连接，Geolocation可能不可用');
        }
    }

    // 3. 检查是否为移动端
    const ua = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/i.test(ua);
    const isAndroid = /android/i.test(ua);
    const isWeChat = /micromessenger/i.test(ua);

    return {
        supported: true,
        isIOS,
        isAndroid,
        isWeChat,
        issues,
        isSecureContext: window.isSecureContext !== false
    };
}

async function checkLocationPermission() {
    if (!navigator.permissions || !navigator.permissions.query) return 'prompt';
    try {
        const result = await navigator.permissions.query({ name: 'geolocation' });
        locationPermissionStatus = result.state;
        result.addEventListener('change', () => {
            locationPermissionStatus = result.state;
            console.log('定位权限状态变化:', result.state);
        });
        return result.state;
    } catch(e) {
        return 'prompt';
    }
}

function showPermissionDialog(options = {}) {
    const overlay = document.getElementById('permission-overlay');
    const descEl = document.getElementById('permission-desc');
    const guideEl = document.getElementById('permission-guide');
    const guideStepsEl = document.getElementById('guide-steps');
    const allowBtn = document.getElementById('permission-allow-btn');
    const denyBtn = document.getElementById('permission-deny-btn');

    descEl.textContent = options.desc ||
        '为了提供准确的实时导航和位置服务，需要获取您的当前位置。您的位置信息仅用于导航，不会被存储。';

    guideEl.style.display = 'none';
    allowBtn.style.display = '';
    denyBtn.style.display = '';
    overlay.style.display = 'flex';

    return new Promise((resolve) => {
        const newAllowBtn = allowBtn.cloneNode(true);
        const newDenyBtn = denyBtn.cloneNode(true);
        allowBtn.parentNode.replaceChild(newAllowBtn, allowBtn);
        denyBtn.parentNode.replaceChild(newDenyBtn, denyBtn);

        newAllowBtn.addEventListener('click', async () => {
            overlay.style.display = 'none';
            try {
                await new Promise((res, rej) => {
                    navigator.geolocation.getCurrentPosition(res, rej, {
                        enableHighAccuracy: true,
                        timeout: 15000,
                        maximumAge: 0
                    });
                });
                locationPermissionStatus = 'granted';
                showToast('定位权限已授权', 'success');
                resolve(true);
            } catch (e) {
                console.error('[定位] 获取位置失败:', e.message, e.code);
                if (e.code === e.PERMISSION_DENIED) {
                    locationPermissionStatus = 'denied';
                    showPermissionGuide();
                    resolve(false);
                } else if (e.code === e.POSITION_UNAVAILABLE) {
                    showToast('无法获取位置信号，请检查GPS/定位服务', 'error');
                    resolve(false);
                } else if (e.code === e.TIMEOUT) {
                    showToast('定位超时，请重试或在开阔处再试', 'warning');
                    resolve(false);
                } else {
                    showToast(`定位失败(${e.code || '未知'}): ${e.message}`, 'error');
                    resolve(false);
                }
            }
        });

        newDenyBtn.addEventListener('click', () => {
            overlay.style.display = 'none';
            locationPermissionStatus = 'denied';
            if (options.onDeny) options.onDeny();
            showToast('未获得定位权限，部分功能不可用', 'warning');
            resolve(false);
        });
    });
}

function showPermissionGuide() {
    const overlay = document.getElementById('permission-overlay');
    const guideEl = document.getElementById('permission-guide');
    const guideStepsEl = document.getElementById('guide-steps');
    const allowBtn = document.getElementById('permission-allow-btn');
    const denyBtn = document.getElementById('permission-deny-btn');

    allowBtn.style.display = 'none';
    denyBtn.style.display = 'none';

    const ua = navigator.userAgent.toLowerCase();
    let steps = '';

    if (ua.includes('micromessenger')) {
        steps = `
            <div class="guide-step"><strong>1.</strong> 点击右上角 <strong>"···"</strong> 菜单</div>
            <div class="guide-step"><strong>2.</strong> 选择 <strong>"在浏览器中打开"</strong></div>
            <div class="guide-step"><strong>3.</strong> 在浏览器中重新允许定位权限</div>`;
    } else if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('mac')) {
        steps = `
            <div class="guide-step"><strong>1.</strong> 打开 <strong>设置</strong> → 找到此浏览器App</div>
            <div class="guide-step"><strong>2.</strong> 点击 <strong>"位置"</strong> → 选择 <strong>"使用App期间"</strong></div>
            <div class="guide-step"><strong>3.</strong> 返回此页面并刷新</div>`;
    } else if (ua.includes('android')) {
        steps = `
            <div class="guide-step"><strong>1.</strong> 点击地址栏左侧的 <strong>🔒</strong> 图标</div>
            <div class="guide-step"><strong>2.</strong> 找到 <strong>"位置"</strong> 权限 → 选择 <strong>"允许"</strong></div>
            <div class="guide-step"><strong>3.</strong> 刷新本页面</div>`;
    } else {
        steps = `
            <div class="guide-step"><strong>1.</strong> 点击浏览器地址栏左侧的<strong>信息图标</strong></div>
            <div class="guide-step"><strong>2.</strong> 将 <strong>"位置"</strong> 权限设置为 <strong>"允许"</strong></div>
            <div class="guide-step"><strong>3.</strong> 刷新页面后重试</div>`;
    }

    guideStepsEl.innerHTML = steps;
    guideEl.style.display = 'block';
    overlay.style.display = 'flex';

    document.querySelector('.permission-title').textContent = '需要手动开启定位';
    document.getElementById('permission-desc').textContent = '检测到定位权限已被拒绝，请按以下步骤手动开启：';
}

function hidePermissionDialog() {
    document.getElementById('permission-overlay').style.display = 'none';
}

function showLocationStatus(text, icon = '📍', type = 'loading') {
    const bar = document.getElementById('location-status-bar');
    const textEl = document.getElementById('loc-status-text');
    const iconEl = document.getElementById('loc-status-icon');

    bar.className = 'location-status-bar status-' + type;
    textEl.textContent = text;
    iconEl.textContent = icon;
    bar.style.display = 'flex';
}

function hideLocationStatus() {
    document.getElementById('location-status-bar').style.display = 'none';
}

async function requestLocationPermission(options = {}) {
    if (!navigator.geolocation) {
        showToast('您的浏览器不支持定位功能', 'error');
        return false;
    }

    let status = locationPermissionStatus;
    if (status === 'prompt') status = await checkLocationPermission();

    if (status === 'granted') return true;

    if (status === 'denied') {
        if (isMobile || options.forceDialog) {
            showPermissionDialog({ onDeny: options.onDeny });
            return false;
        } else {
            showToast('请在浏览器设置中允许定位权限', 'error');
            return false;
        }
    }

    return await showPermissionDialog({ desc: options.desc, onDeny: options.onDeny });
}

async function requestAndGetCurrentPosition(options = {}) {
    if (window.isSecureContext === false && window.location.protocol !== 'https:') {
        console.warn('[定位] HTTP环境下尝试获取位置');
    }

    const hasPermission = await requestLocationPermission({
        desc: options.desc || '为了获取您的当前位置以开始导航，需要使用定位服务。',
        forceDialog: options.forceDialog
    });

    if (!hasPermission && !options.allowFallback) return null;

    return await getPositionWithRetry(options);
}

async function getPositionWithRetry(options = {}, maxRetries = 2) {
    const timeout = options.timeout || 20000;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        if (attempt > 0) {
            showLocationStatus(`正在重试获取位置 (${attempt}/${maxRetries})...`, '🛰️', 'loading');
            await new Promise(r => setTimeout(r, 1000 * attempt));
        }

        try {
            const result = await new Promise((resolve, reject) => {
                showLocationStatus(attempt === 0 ? '正在获取位置...' : `重试中 (${attempt}/${maxRetries})...`, '🛰️', 'loading');

                const timeoutId = setTimeout(() => {
                    reject({ code: 3, message: '定位超时' });
                }, timeout);

                navigator.geolocation.getCurrentPosition(
                    position => { clearTimeout(timeoutId); resolve(position); },
                    err => { clearTimeout(timeoutId); reject(err); },
                    {
                        enableHighAccuracy: attempt < maxRetries,
                        timeout: timeout,
                        maximumAge: attempt > 0 ? 5000 : 0
                    }
                );
            });

            hideLocationStatus();
            showLocationStatus('定位成功', '✅', 'success');
            setTimeout(hideLocationStatus, 2000);

            const lat = result.coords.latitude;
            const lng = result.coords.longitude;
            const gcj = wgs84ToGcj02(lat, lng);

            return {
                lat: gcj.lat, lng: gcj.lng,
                originalLat: lat, originalLng: lng,
                accuracy: result.coords.accuracy,
                heading: result.coords.heading,
                speed: result.coords.speed,
                timestamp: result.timestamp
            };
        } catch (error) {
            console.error(`[定位] 第${attempt+1}次尝试失败:`, error.message || error.code);

            if (error.code === 1 || error.code === error?.PERMISSION_DENIED) {
                hideLocationStatus();
                locationPermissionStatus = 'denied';
                showLocationStatus('定位被拒绝', '❌', 'error');
                if (isMobile) setTimeout(() => { hideLocationStatus(); showPermissionGuide(); }, 1500);
                if (options.onError) options.onError(error);
                return null;
            }

            if (attempt === maxRetries) {
                hideLocationStatus();
                const errorMsg = error.code === 2 ? '无法获取位置信号，请检查GPS/网络' : '定位超时，请检查GPS信号或在开阔处重试';
                showLocationStatus(errorMsg, '⚠️', 'error');
                setTimeout(hideLocationStatus, 4000);
                if (options.onError) options.onError(error);
                return null;
            }
        }
    }
    return null;
}

function createUserLocationMarker(lat, lng, accuracy, heading = null) {
    if (userLocationMarker) map.removeLayer(userLocationMarker);
    if (userAccuracyCircle) map.removeLayer(userAccuracyCircle);

    const hasHeading = heading !== null && !isNaN(heading);
    const arrowRotation = hasHeading ? heading : 0;

    const userIcon = L.divIcon({
        className: 'user-location-marker',
        html: `<div class="user-location-inner" style="transform: rotate(${arrowRotation}deg);">
            <div class="user-location-arrow"></div>
            <div class="user-location-dot"></div>
        </div>`,
        iconSize: [24, 24], iconAnchor: [12, 12]
    });

    userLocationMarker = L.marker([lat, lng], { icon: userIcon, zIndexOffset: 1000 }).addTo(map);
    userAccuracyCircle = L.circle([lat, lng], {
        radius: accuracy, color: '#2196f3', fillColor: '#2196f3',
        fillOpacity: 0.1, weight: 1, className: 'accuracy-circle'
    }).addTo(map);

    const accuracyText = accuracy < 1000 ? `±${Math.round(accuracy)}m` : '低精度';
    userLocationMarker.bindTooltip(`📍 当前位置 ${accuracyText}`, {
        permanent: false, direction: 'top', offset: [0, -15], className: 'user-location-tooltip'
    });

    return { marker: userLocationMarker, circle: userAccuracyCircle };
}

function animateMarkerTo(marker, newLatLng, duration = 500) {
    const startLatLng = marker.getLatLng();
    const startTime = performance.now();

    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        marker.setLatLng([
            startLatLng.lat + (newLatLng.lat - startLatLng.lat) * easeProgress,
            startLatLng.lng + (newLatLng.lng - startLatLng.lng) * easeProgress
        ]);
        if (progress < 1) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
}

/**
 * 自适应卡尔曼滤波器
 * - 根据GPS精度动态调整滤波强度（精度差→更平滑，精度好→更灵敏）
 * - 根据速度调整（速度快→更多平滑）
 * - 检测并抑制GPS跳变
 */
function kalmanFilter(newPosition, lastPosition) {
    if (!lastPosition) return newPosition;
    const dt = (newPosition.timestamp - lastPosition.timestamp) / 1000;
    if (dt <= 0 || dt > 10) return newPosition;

    // 基础alpha根据GPS精度动态调整
    let alpha = 0.3;
    const acc = newPosition.accuracy || 50;
    if (acc <= 5) alpha = 0.5;          // 高精度：灵敏响应
    else if (acc <= 15) alpha = 0.4;    // 良好
    else if (acc <= 50) alpha = 0.25;   // 一般
    else if (acc <= 200) alpha = 0.15;  // 较差：强力平滑
    else alpha = 0.08;                   // 很差：最大平滑

    // 根据速度调整：速度越快需要越多平滑
    const speed = newPosition.speed || 0;
    if (speed > 3) alpha *= 0.7;        // 跑步/骑行
    else if (speed > 1.5) alpha *= 0.85;// 快走

    // 时间间隔补偿：间隔越长，越信任新数据
    const timeFactor = Math.min(dt / 2, 1);
    alpha = Math.min(alpha + (1 - alpha) * timeFactor * 0.3, 0.6);

    // GPS跳变检测：单次移动>500米视为异常
    const dx = newPosition.lat - lastPosition.lat;
    const dy = newPosition.lng - lastPosition.lng;
    const moveDist = Math.sqrt(dx * dx + dy * dy);
    if (moveDist > 0.005) alpha *= 0.2;

    return {
        lat: lastPosition.lat + alpha * (newPosition.lat - lastPosition.lat),
        lng: lastPosition.lng + alpha * (newPosition.lng - lastPosition.lng),
        accuracy: lastPosition.accuracy * (1 - alpha) + acc * alpha,
        heading: newPosition.heading,
        speed: lastPosition.speed ? lastPosition.speed * (1 - alpha) + (newPosition.speed || 0) * alpha : (newPosition.speed || 0),
        timestamp: newPosition.timestamp
    };
}

/**
 * GPS质量分级评估
 */
function assessGPSQuality(acc) {
    if (acc <= 5)   return { level: 'excellent', label: '高精度', color: '#28a745' };
    if (acc <= 15)  return { level: 'good',     label: '良好',   color: '#28a745' };
    if (acc <= 50)  return { level: 'fair',     label: '一般',   color: '#ffc107' };
    if (acc <= 200) return { level: 'poor',     label: '较差',   color: '#fd7e14' };
    return               { level: 'very_poor', label: '信号弱',  color: '#dc3545' };
}

/**
 * 从位置历史推算航向角（当设备不提供heading时使用）
 */
function deriveHeadingFromHistory() {
    if (positionHistory.length < 3) return null;
    let sumLat = 0, sumLng = 0, totalWeight = 0;
    for (let i = positionHistory.length - 1; i >= Math.max(0, positionHistory.length - 3); i--) {
        const w = i - (positionHistory.length - 3) + 1;
        if (i > 0) {
            sumLat += (positionHistory[i].lat - positionHistory[i-1].lat) * w;
            sumLng += (positionHistory[i].lng - positionHistory[i-1].lng) * w;
            totalWeight += w;
        }
    }
    if (totalWeight === 0) return null;
    return (Math.atan2(sumLng, sumLat) * 180 / Math.PI + 360) % 360;
}

function handlePositionUpdate(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const gcj = wgs84ToGcj02(lat, lng);
    const accuracy = position.coords.accuracy;
    let heading = position.coords.heading;
    const speed = position.coords.speed;
    const timestamp = position.timestamp;

    if (accuracy > 2000) {
        consecutivePoorGPS++;
        if (consecutivePoorGPS > 3) return; // 连续多次低质量才丢弃
    } else {
        consecutivePoorGPS = 0;
    }

    // GPS质量分级
    const quality = assessGPSQuality(accuracy);
    gpsQualityLevel = quality.level;

    let newPosition = { lat: gcj.lat, lng: gcj.lng, accuracy, heading, speed, timestamp };

    if (lastPosition) newPosition = kalmanFilter(newPosition, lastPosition);

    // 航向角：优先用设备提供，否则从历史轨迹推算
    if ((heading === null || isNaN(heading)) && positionHistory.length >= 3) {
        newPosition.heading = deriveHeadingFromHistory();
    }

    positionHistory.push(newPosition);
    if (positionHistory.length > 15) positionHistory.shift();

    // 速度平滑（用于显示）
    if (newPosition.speed > 0) {
        smoothedSpeed = smoothedSpeed * 0.7 + newPosition.speed * 0.3;
    } else if (smoothedSpeed > 0) {
        smoothedSpeed *= 0.9; // 无速度数据时衰减
    }

    if (!userLocationMarker) {
        createUserLocationMarker(newPosition.lat, newPosition.lng, accuracy, newPosition.heading);
    } else {
        animateMarkerTo(userLocationMarker, { lat: newPosition.lat, lng: newPosition.lng });
        if (userAccuracyCircle) {
            userAccuracyCircle.setLatLng([newPosition.lat, newPosition.lng]);
            userAccuracyCircle.setRadius(accuracy);
        }
        if (newPosition.heading !== null && !isNaN(newPosition.heading)) {
            const inner = userLocationMarker.getElement()?.querySelector('.user-location-inner');
            if (inner) inner.style.transform = `rotate(${newPosition.heading}deg)`;
        }
    }

    if (isFollowingUser && !isRealTimeNavigating) {
        map.panTo([newPosition.lat, newPosition.lng], { animate: true, duration: 0.3 });
    }

    if (isRealTimeNavigating && navigationPath) {
        updateRealTimeNavigation(newPosition);
    }

    lastPosition = newPosition;
    lastGPSUpdateTime = Date.now();
    updateLocationInfo(newPosition);
}

function updateLocationInfo(position) {
    const infoEl = document.getElementById('location-info-text');
    if (infoEl) {
        const accuracyText = position.accuracy < 1000 ? `±${Math.round(position.accuracy)}m` : '低精度';
        infoEl.innerHTML = `📍 ${position.lat.toFixed(5)}, ${position.lng.toFixed(5)} ${accuracyText}`;
    }
}

function handlePositionError(error) {
    let errorMsg = '';
    switch(error.code) {
        case error.PERMISSION_DENIED:
            errorMsg = '请允许定位权限以使用导航功能'; locationPermissionStatus = 'denied'; stopRealTimeLocation(); break;
        case error.POSITION_UNAVAILABLE:
            errorMsg = '位置信息暂时不可用'; break;
        case error.TIMEOUT:
            errorMsg = '定位超时，请检查GPS信号'; break;
        default:
            errorMsg = '定位发生错误'; break;
    }
    showToast(errorMsg, 'error');
    if (isRealTimeNavigating) {
        setTimeout(() => { if(isRealTimeNavigating) startRealTimeLocation(); }, 3000);
    }
}

function startRealTimeLocation() {
    if (!navigator.geolocation) { showToast('您的浏览器不支持定位功能', 'error'); return false; }
    stopRealTimeLocation();
    try {
        locationWatchId = navigator.geolocation.watchPosition(handlePositionUpdate, handlePositionError, {
            enableHighAccuracy: true, timeout: 15000, maximumAge: 0
        });
        return true;
    } catch(e) {
        console.error('watchPosition异常:', e); showToast('无法启动定位服务', 'error'); return false;
    }
}

function stopRealTimeLocation() {
    if (locationWatchId !== null) { navigator.geolocation.clearWatch(locationWatchId); locationWatchId = null; }
    if (gpsWatchdogTimer) { clearInterval(gpsWatchdogTimer); gpsWatchdogTimer = null; }
    isRealTimeNavigating = false;
    isFollowingUser = false;
    lastGPSUpdateTime = 0;
    updateNavigationUI();
}

// GPS 看门狗：检测 GPS 是否长时间未更新
function startGPSWatchdog() {
    if (gpsWatchdogTimer) clearInterval(gpsWatchdogTimer);
    lastGPSUpdateTime = Date.now();
    gpsWatchdogTimer = setInterval(() => {
        if (!isRealTimeNavigating) return;
        const elapsed = Date.now() - lastGPSUpdateTime;
        if (elapsed > 15000 && !navigationPath) {
            showToast('⚠️ 无法获取 GPS 信号，请检查定位权限', 'warning');
        } else if (elapsed > 8000 && lastPosition === null) {
            // 静默等待，不频繁提示
        }
    }, 2000);
}

async function useCurrentLocation() {
    if (!navigator.geolocation) { showToast('浏览器不支持定位', 'error'); return; }

    const posData = await requestAndGetCurrentPosition({
        desc: '为了将您的当前位置设为起点并显示在地图上，需要获取您的地理位置。',
        forceDialog: isMobile
    });

    if (!posData) return;

    handlePositionUpdateFromData(posData);

    const startInput = document.getElementById('start-input');
    if (startInput) startInput.value = '当前位置';
    currentStart = '当前位置';

    map.setView([posData.lat, posData.lng], 17);
    showToast(`已获取当前位置（精度±${Math.round(posData.accuracy)}米）`);

    startRealTimeLocation();
}

function handlePositionUpdateFromData(posData) {
    let newPosition = {
        lat: posData.lat, lng: posData.lng, accuracy: posData.accuracy,
        heading: posData.heading, speed: posData.speed, timestamp: posData.timestamp || Date.now()
    };

    if (lastPosition) newPosition = kalmanFilter(newPosition, lastPosition);

    positionHistory.push(newPosition);
    if (positionHistory.length > 10) positionHistory.shift();

    if (!userLocationMarker) {
        createUserLocationMarker(newPosition.lat, newPosition.lng, newPosition.accuracy, newPosition.heading);
    } else {
        animateMarkerTo(userLocationMarker, { lat: newPosition.lat, lng: newPosition.lng });
        if (userAccuracyCircle) {
            userAccuracyCircle.setLatLng([newPosition.lat, newPosition.lng]);
            userAccuracyCircle.setRadius(newPosition.accuracy);
        }
        if (newPosition.heading !== null && !isNaN(newPosition.heading)) {
            const inner = userLocationMarker.getElement()?.querySelector('.user-location-inner');
            if (inner) inner.style.transform = `rotate(${newPosition.heading}deg)`;
        }
    }

    lastPosition = newPosition;
    updateLocationInfo(newPosition);
}

function toggleFollowMode() {
    isFollowingUser = !isFollowingUser;
    const btn = document.getElementById('follow-btn');
    if (btn) btn.classList.toggle('active', isFollowingUser);
    showToast(isFollowingUser ? '已开启地图跟随' : '已关闭地图跟随');
    if (isFollowingUser && lastPosition) map.setView([lastPosition.lat, lastPosition.lng], 17);
}

// ==================== 实时导航模块（纯JS计算） ====================
function calculateDistance(p1, p2) {
    const R = 6371000;
    const dLat = (p2.lat-p1.lat)*Math.PI/180;
    const dLng = (p2.lng-p1.lng)*Math.PI/180;
    const a = Math.sin(dLat/2)*Math.sin(dLat/2) +
              Math.cos(p1.lat*Math.PI/180)*Math.cos(p2.lat*Math.PI/180)*Math.sin(dLng/2)*Math.sin(dLng/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function getClosestPointOnSegment(point, segStart, segEnd) {
    const dx = segEnd.lng-segStart.lng, dy = segEnd.lat-segStart.lat;
    const len2 = dx*dx+dy*dy;
    if (len2===0) return segStart;
    let t = ((point.lng-segStart.lng)*dx+(point.lat-segStart.lat)*dy)/len2;
    t = Math.max(0, Math.min(1, t));
    return { lat: segStart.lat+t*dy, lng: segStart.lng+t*dx };
}

function calculateBearing(from, to) {
    const dLng=(to.lng-from.lng)*Math.PI/180;
    const lat1=from.lat*Math.PI/180, lat2=to.lat*Math.PI/180;
    const y=Math.sin(dLng)*Math.cos(lat2);
    const x=Math.cos(lat1)*Math.sin(lat2)-Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLng);
    return (Math.atan2(y,x)*180/Math.PI+360)%360;
}

function getBearingName(bearing) {
    const directions=['北','东北','东','东南','南','西南','西','西北'];
    return directions[Math.round(bearing/45)%8];
}

async function startRealTimeNavigation() {
    const startInput=document.getElementById('start-input')?.value.trim();
    const endInput=document.getElementById('end-input')?.value.trim();
    if(!endInput){showToast('请先设置目的地','warning');return;}

    if(startInput!=='当前位置'){
        try{
            const posData=await requestAndGetCurrentPosition({
                desc:'为了从您的当前位置开始实时导航，需要获取您的地理位置。',
                forceDialog:isMobile
            });
            if(!posData)return;
            handlePositionUpdateFromData(posData);
            document.getElementById('start-input').value='当前位置';
            currentStart='当前位置';
            beginNavigation();
        }catch(err){
            showToast('定位失败:'+err.message,'error');
        }
    }else{
        if(!lastPosition){
            try{
                const posData=await requestAndGetCurrentPosition({desc:'需要获取您的当前位置以开始导航。',forceDialog:isMobile});
                if(posData){handlePositionUpdateFromData(posData);beginNavigation();}
                else return;
            }catch(err){showToast('定位失败:'+err.message,'error');return;}
        }else beginNavigation();
    }
}

async function beginNavigation() {
    const endInput=document.getElementById('end-input')?.value.trim();
    navigationDestination=endInput||currentEnd||'';

    await navigateLocal();

    if(!currentPathLayer){showToast('无法规划路线','error');return;}

    isRerouting=false; rerouteCount=0; lastRerouteTime=0; reroutePathBackup=null;

    // 重置导航状态变量
    totalDistanceTraveled = 0;
    navigationStartTime = Date.now();
    lastNavUpdateTime = Date.now();
    smoothedSpeed = 0;
    gpsQualityLevel = 'unknown';
    consecutivePoorGPS = 0;
    navTotalDistance = 0;

    // 计算初始路线信息用于面板显示
    let initialNavData=null;
    if(navigationPath&&navigationPath.length>1){
        let totalDist=0;
        for(let i=0;i<navigationPath.length-1;i++)totalDist+=calculateDistance(navigationPath[i],navigationPath[i+1]);
        navTotalDistance=totalDist;
        initialNavData={distance:Math.round(totalDist),eta:Math.round(totalDist/80),endName:navigationDestination,instruction:`前往 ${navigationDestination}`};
    }

    if(startRealTimeLocation()){
        isRealTimeNavigating=true; isFollowingUser=true; currentPathIndex=0;
        const latlngs=currentPathLayer.getLatLngs();
        navigationPath=latlngs.map(ll=>({lat:ll.lat,lng:ll.lng}));

        if(!initialNavData&&navigationPath&&navigationPath.length>1){
            let totalDist=0;
            for(let i=0;i<navigationPath.length-1;i++)totalDist+=calculateDistance(navigationPath[i],navigationPath[i+1]);
            initialNavData={distance:Math.round(totalDist),eta:Math.round(totalDist/80),endName:navigationDestination,instruction:`前往 ${navigationDestination}`};
        }

        showToast('🧭 实时导航已启动','success');
        updateNavigationUI();
        
        startGPSWatchdog();
        
        // 如果已有位置信息，立即更新一次
        if(lastPosition){
            setTimeout(()=>{if(isRealTimeNavigating)updateRealTimeNavigation(lastPosition);},500);
        }
    }
}

function updateRealTimeNavigation(currentPos){
    if(!navigationPath||navigationPath.length<2)return;

    // 1. 在路线上找最近点
    let minDist=Infinity, closestIndex=0, closestPoint=null;
    const searchStart=Math.max(0,currentPathIndex-3);
    const searchEnd=Math.min(navigationPath.length-1,currentPathIndex+8);

    for(let i=searchStart;i<searchEnd;i++){
        if(i>=navigationPath.length-1)break;
        const segStart=navigationPath[i],segEnd=navigationPath[i+1];
        const closest=getClosestPointOnSegment(currentPos,segStart,segEnd);
        const dist=calculateDistance(currentPos,closest);
        if(dist<minDist){minDist=dist;closestIndex=i;closestPoint=closest;}
    }

    // 防止回退（只允许前进或小幅回调）
    if(closestIndex>currentPathIndex)currentPathIndex=closestIndex;
    else if(currentPathIndex>0&&closestIndex<currentPathIndex-3)closestIndex=currentPathIndex;

    const now=Date.now();

    // 2. 偏离检测与自动重规划
    if(minDist>REROUTE_DEVIATION_THRESHOLD&&!isRerouting&&isRealTimeNavigating){
        if(now-lastRerouteTime>REROUTE_COOLDOWN_MS&&rerouteCount<MAX_REROUTE_COUNT){
            rerouteFromCurrentPosition(currentPos);return;
        }else if(rerouteCount>=MAX_REROUTE_COUNT){
            showToast('⛔ 偏离路线较远且已达最大重算次数','warning');return;
        }
    }

    // 3. 精确计算剩余距离（从当前位置到终点的路线距离）
    let remainingDistance = 0;
    
    // 当前位置到最近路段点的距离
    if(closestPoint){
        remainingDistance += calculateDistance(currentPos, closestPoint);
        // 最近点到下一个路径点的距离
        if(closestIndex+1 < navigationPath.length){
            remainingDistance += calculateDistance(closestPoint, navigationPath[closestIndex+1]);
        }
    }
    
    // 剩余路段累加
    for(let i=closestIndex+1;i<navigationPath.length-1;i++){
        remainingDistance+=calculateDistance(navigationPath[i],navigationPath[i+1]);
    }

    // 4. 计算已行走距离
    if(navigationStartTime > 0 && lastNavUpdateTime > 0 && smoothedSpeed > 0.5){
        const timeDelta = (now - lastNavUpdateTime) / 1000; // 秒
        totalDistanceTraveled += smoothedSpeed * timeDelta;
    }
    lastNavUpdateTime = now;

    // 5. 动态ETA：优先用实际速度，其次用平滑速度，最后用默认步行速度
    let effectiveSpeed = (currentPos.speed && currentPos.speed > 0.3) ? currentPos.speed : 
                         (smoothedSpeed > 0.3 ? smoothedSpeed : 1.4); // 默认1.4m/s(约5km/h)
    const etaSeconds = remainingDistance / effectiveSpeed;
    const etaMinutes = Math.ceil(etaSeconds / 60);

    // 6. 导航指令生成
    let nextTurn=null,instructionText='直行';
    if(closestIndex<navigationPath.length-1){
        const nextPoint=navigationPath[Math.min(closestIndex+1,navigationPath.length-1)];
        const bearing=calculateBearing(currentPos,nextPoint);
        nextTurn={bearing,direction:getBearingName(bearing),distance:Math.round(calculateDistance(currentPos,nextPoint))};
        instructionText=generateNavigationInstruction(closestIndex,currentPos,navigationPath,bearing);
    }

    // 7. 到达检测
    const endPoint=navigationPath[navigationPath.length-1];
    const distToEnd = calculateDistance(currentPos,endPoint);
    if(distToEnd<20){
        showToast('🎉 已到达目的地！','success');
        stopRealTimeNavigation();
        return;
    }else if(distToEnd<50){
        instructionText='即将到达目的地';
    }

    // 8. 更新地图上的路线显示（已走过/剩余）
    if(currentPathLayer&&closestIndex>0&&closestIndex<navigationPath.length-1){
        const remainingPoints=[currentPos];
        for(let i=closestIndex+1;i<navigationPath.length;i++)remainingPoints.push(navigationPath[i]);
        currentPathLayer.setLatLngs(remainingPoints.map(p=>[p.lat,p.lng]));
        
        if(!window.traveledPathLayer){
            const traveledPoints=navigationPath.slice(0,closestIndex+1);
            if(traveledPoints.length>=2)
                window.traveledPathLayer=L.polyline(traveledPoints.map(p=>[p.lat,p.lng]),
                    {color:'#4caf50',weight:5,opacity:0.45,dashArray:'8,6',lineCap:'round'}).addTo(map);
        }else{
            const traveledPoints=navigationPath.slice(0,closestIndex+1);
            if(traveledPoints.length>=2)window.traveledPathLayer.setLatLngs(traveledPoints.map(p=>[p.lat,p.lng]));
        }
    }

    if(isFollowingUser)map.panTo([currentPos.lat,currentPos.lng],{animate:true,duration:0.3});
}

async function rerouteFromCurrentPosition(currentPos){
    if(!navigationDestination||isRerouting||!isRealTimeNavigating)return;
    isRerouting=true;lastRerouteTime=Date.now();rerouteCount++;
    showReroutingStatus(true);
    try{
        if(navigationPath)reroutePathBackup=[...navigationPath];

        // 使用本地导航引擎重新规划
        const result=campusNavigator.navigateFromGPS(currentPos.lat,currentPos.lng,navigationDestination);
        if(result.success){
            if(currentPathLayer)currentPathLayer.setStyle({opacity:0.2});
            await new Promise(r=>setTimeout(r,250));

            if(currentPathLayer)map.removeLayer(currentPathLayer);
            map.eachLayer(layer=>{if(layer.options&&layer.options.className==='path-arrow')map.removeLayer(layer);});

            drawPath(result.pathCoordinates);
            if(currentPathLayer){currentPathLayer.setStyle({color:'#ff5722'});
                setTimeout(()=>{if(currentPathLayer&&isRealTimeNavigating)currentPathLayer.setStyle({color:'#3388ff'});},3000);}

            addStartEndMarkers({lat:currentPos.lat,lng:currentPos.lng},
                result.end?.coordinates||result.pathCoordinates[result.pathCoordinates.length-1]);

            navigationPath=result.pathCoordinates.map(p=>({lat:p.lat,lng:p.lng}));
            currentPathIndex=0;reroutePathBackup=null;

            const resultEl=document.getElementById('nav-result');
            if(resultEl)resultEl.innerHTML=`
                <div class="nav-info-card rerouted-card">
                    <div class="nav-route">📍 当前位置 → ${result.end?.name||navigationDestination}</div>
                    <div class="nav-details">
                        <span>📏 ${result.distance}m</span><span>⏱️ ${result.walkTime}分钟</span>
                    </div>
                    <div class="nav-reroute-badge">🔄 路线已更新</div>
                </div>`;

            showToast(`🔄 路线已重新规划 (${result.distance}m)`,'success');
        }else{
            showToast('重规划失败: '+ (result.error||'未知错误'),'error');
        }
    }catch(error){
        console.error('[重规划]异常:',error);showToast('重规划失败，请检查网络','error');
        if(reroutePathBackup){navigationPath=reroutePathBackup;reroutePathBackup=null;}
    }finally{isRerouting=false;showReroutingStatus(false);}
}

function generateNavigationInstruction(pathIndex,currentPos,path,bearing){
    if(pathIndex>=path.length-1)return'即将到达';
    const nextPoint=path[pathIndex+1];
    const distToNext=calculateDistance(currentPos,nextPoint);
    const direction=getBearingName(bearing);
    let turnInfo='';
    for(let i=pathIndex+1;i<Math.min(pathIndex+4,path.length-1);i++){
        const b1=calculateBearing(path[i],path[i+1]),b0=i===pathIndex?bearing:calculateBearing(path[i-1],path[i]);
        const angleDiff=normalizeAngleDiff(b1-b0);
        if(Math.abs(angleDiff)>30){
            let turnDist=0;
            for(let j=pathIndex;j<=i;j++){if(j<path.length-1)turnDist+=calculateDistance(path[j],path[j+1]);}
            const turnDir=angleDiff>0?'右':'左';
            turnInfo=`，前方${Math.round(turnDist)}米${turnDir}转`;break;
        }
    }
    if(distToNext<10)return direction+turnInfo||'继续前行';
    return`向${direction} ${Math.round(distToNext)}米`+turnInfo;
}

function normalizeAngleDiff(angle){
    while(angle>180)angle-=360;while(angle<-180)angle+=360;return angle;
}

function stopRealTimeNavigation(){
    isRealTimeNavigating=false;navigationPath=null;navigationDestination='';
    currentPathIndex=0;isRerouting=false;rerouteCount=0;lastRerouteTime=0;reroutePathBackup=null;
    totalDistanceTraveled=0;navigationStartTime=0;lastNavUpdateTime=0;
    smoothedSpeed=0;gpsQualityLevel='unknown';

    if(currentPathLayer){map.removeLayer(currentPathLayer);currentPathLayer=null;}
    map.eachLayer(layer=>{if(layer.options&&layer.options.className==='path-arrow')map.removeLayer(layer);});
    if(window.traveledPathLayer){map.removeLayer(window.traveledPathLayer);window.traveledPathLayer=null;}
    if(currentStartMarker){map.removeLayer(currentStartMarker);currentStartMarker=null;}
    if(currentEndMarker){map.removeLayer(currentEndMarker);currentEndMarker=null;}

    stopRealTimeLocation();showToast('导航已结束');
}

function getDirectionArrow(bearing){
    const arrows=['↑','↗','→','↘','↓','↙','←','↖'];
    return arrows[Math.round(bearing/45)%8];
}

function updateNavigationUI(){
    const btn=document.getElementById('realtime-nav-btn');
    if(btn){btn.textContent=isRealTimeNavigating?'停止导航':'实时导航';btn.classList.toggle('navigating',isRealTimeNavigating);}
}

// ==================== 导航功能（纯本地计算） ====================
async function navigateLocal() {
    let start = document.getElementById('start-input')?.value.trim() || '';
    let end = document.getElementById('end-input')?.value.trim() || '';
    if (!start || !end) { showToast('请填写起点和终点', 'warning'); return; }

    if (start === '当前位置') {
        if (lastPosition) {
            return await navigateFromGPSSimple(lastPosition, end);
        } else if (userLocationMarker) {
            const latlng=userLocationMarker.getLatLng();
            return await navigateFromGPSSimple({lat:latlng.lat,lng:latlng.lng},end);
        }else{showToast('请先获取当前位置','warning');return;}
    }
    await performNavigationLocal(start, end);
}

async function navigateFromGPSSimple(gpsPosition, endName) {
    const navBtn=document.getElementById('navigate-btn');
    if(navBtn){navBtn.disabled=true;navBtn.textContent='计算中...';}
    try{
        const result=campusNavigator.navigateFromGPS(gpsPosition.lat,gpsPosition.lng,endName);
        handleNavigationResult(result,'当前位置',endName);
    }catch(error){console.error('导航失败:',error);showToast('导航失败','error');}
    finally{const nb=document.getElementById('navigate-btn');if(nb){nb.disabled=false;nb.textContent='开始导航';}}
}

async function performNavigationLocal(start, end) {
    const navBtn=document.getElementById('navigate-btn');
    if(navBtn){navBtn.disabled=true;navBtn.textContent='计算中...';}
    try{
        const [startId,startNode]=campusNavigator.searchBuilding(start);
        const [endId,endNode]=campusNavigator.searchBuilding(end);

        if(!startId||!startNode){showToast(`找不到起点: ${start}`,'error');return;}
        if(!endId||!endNode){showToast(`找不到终点: ${end}`,'error');return;}

        const result=campusNavigator.findShortestPath(startId,endId);
        if(!result.success){showToast(result.error||'无法计算路径','error');return;}

        const pathCoordinates=result.path.map(id=>({
            node_id:id,name:campusNavigator.nodes[id].name,
            lat:campusNavigator.nodes[id].coordinates[1],lng:campusNavigator.nodes[id].coordinates[0],
            type:campusNavigator.nodes[id].type
        }));

        handleNavigationResultLocal({
            success:true,
            start:{id:startId,name:startNode.name,lat:startNode.coordinates[1],lng:startNode.coordinates[0]},
            end:{id:endId,name:endNode.name,lat:endNode.coordinates[1],lng:endNode.coordinates[0]},
            distance:result.distance,walkTime:result.walkTime,
            pathNames:result.pathNames,pathCoordinates
        },start,end);
    }catch(error){console.error('导航失败:',error);showToast('导航失败','error');}
    finally{const nb=document.getElementById('navigate-btn');if(nb){nb.disabled=false;nb.textContent='开始导航';}}
}

function handleNavigationResult(result,startName,endName){
    const resultEl=document.getElementById('nav-result');

    if(result.success&&resultEl){
        // 兼容 camelCase (本地引擎) 和 snake_case (旧API) 两种格式
        const pathCoords=result.pathCoordinates||result.path_coordinates||[];
        const pathNames=result.pathNames||result.path_names||[];
        const startNode=result.start||{};
        const endNode=result.end||{};
        const startCoord=startNode.coordinates||(pathCoords[0]?{lat:pathCoords[0].lat,lng:pathCoords[0].lng}:{lat:startNode.lat,lng:startNode.lng});
        const endCoord=endNode.coordinates||(pathCoords.length?{lat:pathCoords[pathCoords.length-1].lat,lng:pathCoords[pathCoords.length-1].lng}:{lat:endNode.lat,lng:endNode.lng});

        resultEl.innerHTML=`
            <div class="nav-info-card">
                <div class="nav-route">${startNode.name||startName} → ${endNode.name||endName}</div>
                <div class="nav-details">
                    <span>📏 ${result.distance}米</span><span>⏱️ ${result.walkTime||Math.round(result.distance/80)}分钟</span>
                </div>
                <div class="nav-path">${pathNames.join(' → ')}</div>
            </div>`;
        drawPath(pathCoords);
        addStartEndMarkers(startCoord,endCoord);
        currentStart=startName;currentEnd=endName;
        showQuickNav(startNode.name||startName,endNode.name||endName);
        showToast('路线规划完成');
    }else if(resultEl){
        resultEl.innerHTML=`<div class="error-card">❌ ${result.error||'计算失败'}</div>`;
        showToast(result.error||'计算失败','error');
    }
}

function handleNavigationResultLocal(result,startName,endName){
    const resultEl=document.getElementById('nav-result');
    if(result.success&&resultEl){
        resultEl.innerHTML=`
            <div class="nav-info-card">
                <div class="nav-route">${result.start.name} → ${result.end.name}</div>
                <div class="nav-details">
                    <span>📏 ${result.distance}米</span><span>⏱️ ${result.walkTime}分钟</span>
                </div>
                <div class="nav-path">${result.pathNames.join(' → ')}</div>
            </div>`;
        drawPath(result.pathCoordinates);
        addStartEndMarkers(result.start,result.end);
        currentStart=startName;currentEnd=endName;
        showQuickNav(result.start.name,result.end.name);
        showToast('路线规划完成');
    }else if(resultEl){
        resultEl.innerHTML=`<div class="error-card">❌ 计算失败</div>`;
        showToast('计算失败','error');
    }
}

function quickNavigate(){navigateLocal();if(window.innerWidth<=1024)document.getElementById('control-panel')?.classList.remove('open');}
function closeQuickNav(){const bar=document.getElementById('quick-nav-bar');if(bar)bar.style.display='none';}
function showQuickNav(startName,endName){
    const bar=document.getElementById('quick-nav-bar');
    const qs=document.getElementById('quick-start'),qe=document.getElementById('quick-end');
    if(qs)qs.innerHTML=`🚩 ${startName}`;if(qe)qe.innerHTML=`🎯 ${endName}`;
    if(bar)bar.style.display='block';setTimeout(()=>{if(bar)bar.style.display='none';},5000);
}

// ==================== 绘制路径 ====================
function drawPath(pathCoordinates){
    if(currentPathLayer){map.removeLayer(currentPathLayer);}
    if(!pathCoordinates||pathCoordinates.length<2){console.warn('路径点不足2个');return;}

    console.log('绘制路径，经过',pathCoordinates.length,'个节点');

    const latlngs=pathCoordinates.map(p=>[p.lat,p.lng]);

    L.polyline(latlngs,{color:'#66b0ff',weight:12,opacity:0.25,lineCap:'round',lineJoin:'round'}).addTo(map);
    currentPathLayer=L.polyline(latlngs,{color:'#3388ff',weight:6,opacity:0.95,lineCap:'round',lineJoin:'round'}).addTo(map);
    L.polyline(latlngs,{color:'#ffffff',weight:2,opacity:0.6,dashArray:'10,10',lineCap:'round',lineJoin:'round'}).addTo(map);

    for(let i=0;i<latlngs.length-1;i++){
        const p1=latlngs[i],p2=latlngs[i+1];
        const dx=p2[0]-p1[0],dy=p2[1]-p1[1];
        const distance=Math.sqrt(dx*dx+dy*dy)*111000;
        const arrowCount=Math.min(Math.floor(distance/100),2);
        for(let s=1;s<=arrowCount;s++){
            const ratio=s/(arrowCount+1);
            const midLat=p1[0]+dx*ratio,midLng=p1[1]+dy*ratio;
            const angle=Math.atan2(-dx,dy)*180/Math.PI;

            const arrowSvg=`<svg width="24"height="24"viewBox="0 0 24 24"style="overflow:visible;">
                <g transform="translate(12,12)rotate(${angle})">
                    <path d="M-8,-6 L4,0 L-8,6 L-5,0 Z"fill="#fff"stroke="#3388ff"stroke-width="1.5"stroke-linejoin="round"/>
                </g></svg>`;

            const arrowIcon=L.divIcon({className:'path-arrow',html:arrowSvg,iconSize:[24,24],iconAnchor:[12,12]});
            L.marker([midLat,midLng],{icon:arrowIcon,interactive:false}).addTo(map);
        }
    }
    map.fitBounds(currentPathLayer.getBounds(),{padding:[50,50]});
}

function addStartEndMarkers(startCoord,endCoord){
    if(currentStartMarker)map.removeLayer(currentStartMarker);
    if(currentEndMarker)map.removeLayer(currentEndMarker);
    currentStartMarker=L.circleMarker([startCoord.lat,startCoord.lng],{radius:12,color:'#28a745',fillColor:'#28a745',fillOpacity:1,weight:3}).addTo(map);
    currentStartMarker.bindTooltip('🚩 起点',{permanent:true,direction:'top',offset:[0,-15]});
    currentEndMarker=L.circleMarker([endCoord.lat,endCoord.lng],{radius:12,color:'#dc3545',fillColor:'#dc3545',fillOpacity:1,weight:3}).addTo(map);
    currentEndMarker.bindTooltip('🎯 终点',{permanent:true,direction:'top',offset:[0,-15]});
}

// ==================== 搜索建筑（本地搜索） ====================
function searchBuilding() {
    const query = document.getElementById('search-input')?.value.trim();
    if (!query) { showToast('请输入建筑名称', 'warning'); return; }

    const [bid, building] = campusNavigator.searchBuilding(query);
    const resultEl = document.getElementById('search-result');

    if (building && resultEl) {
        resultEl.innerHTML = `
            <div class="info-card">
                <div class="info-title">✅ ${building.name}</div>
                <div class="info-desc">${building.description || '暂无描述'}</div>
                ${building.info ? `<div style="font-size:12px;color:#999;margin-top:8px">${building.info}</div>` : ''}
                <div style="display:flex;gap:8px;margin-top:12px">
                    <button onclick="setAsStart('${building.name}')" style="flex:1;padding:8px;background:#28a745;color:white;border:none;border-radius:8px;cursor:pointer">设为起点</button>
                    <button onclick="setAsEnd('${building.name}')" style="flex:1;padding:8px;background:#dc3545;color:white;border:none;border-radius:8px;cursor:pointer">设为终点</button>
                </div>
            </div>`;
        map.setView([building.coordinates[1], building.coordinates[0]], 18);
        if (window.innerWidth <= 1024) { switchTab('nav'); document.getElementById('control-panel')?.classList.remove('open'); }
    } else if (resultEl) {
        resultEl.innerHTML = `<div class="error-card">❌ 未找到匹配: "${query}"</div>`;
    }
}

function locateUser() { useCurrentLocation(); }

function switchTab(tabName) {
    ['nav','search','buildings'].forEach(t => {
        const tabBtn = document.querySelector(`.tab-btn[data-tab="${t}"]`);
        const tabContent = document.getElementById(`tab-${t}`);
        if(t===tabName){if(tabBtn)tabBtn.classList.add('active');if(tabContent)tabContent.classList.add('active');}
        else{if(tabBtn)tabBtn.classList.remove('active');if(tabContent)tabContent.classList.remove('active');}
    });
}

function showToast(message,type='info'){
    const existing=document.querySelector('.toast');if(existing)existing.remove();
    const toast=document.createElement('div');toast.className='toast';toast.textContent=message;
    document.body.appendChild(toast);setTimeout(()=>toast.remove(),2000);
}

// 兼容旧接口
function navigate() { navigateLocal(); }
function showReroutingStatus(isActive){
    const statusEl=document.getElementById('nav-status');
    if(statusEl){statusEl.innerHTML=isActive?'🔄 规划新路线...':'🧭 导航中';statusEl.classList.toggle('rerouting',isActive);}
}

// ==================== 页面初始化 ====================
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM加载完成，初始化校园导航系统（静态版-GitHub Pages）...');
    console.log('[环境] 协议:', window.location.protocol);
    console.log('[环境] 主机:', window.location.host);
    console.log('[环境] 是否HTTPS:', window.location.protocol === 'https:');
    console.log('[环境] 安全上下文:', window.isSecureContext);

    // 初始化导航引擎（纯JS实现，无需后端）
    campusNavigator = new CampusNavigator(CAMPUS_DATA);

    detectDevice();
    initMap();

    // 环境检测
    const envCheck = checkLocationEnvironment();
    if (!envCheck.supported) {
        console.error('[定位] 浏览器不支持 Geolocation API');
        showToast('您的浏览器不支持定位功能', 'error');
    } else if (!envCheck.isSecureContext) {
        const isLocalhost = /localhost|127\.0\.0\.1|::1|\[::1\]/i.test(window.location.hostname);
        if (!isLocalhost) {
            console.warn('[定位] 非安全上下文(HTTP)，Geolocation可能不可用');
            
            // 显示HTTP警告条
            const warningBar = document.createElement('div');
            warningBar.id = 'http-warning-bar';
            warningBar.style.cssText = `
                position:fixed;top:0;left:0;right:0;z-index:9999;
                background:linear-gradient(135deg,#ff6b6b,#ee5a24);
                color:white;padding:10px 15px;text-align:center;font-size:14px;font-weight:bold;
                box-shadow:0 2px 8px rgba(0,0,0,0.3);`;
            warningBar.innerHTML = '🔒 当前为HTTP连接，定位受限！GitHub Pages部署后将自动启用HTTPS | <a href="#" onclick="this.parentElement.style.display=\'none\'"style="color:#fff;text-decoration:underline;">关闭</a>';
            document.body.appendChild(warningBar);
            document.querySelector('.map-container').style.paddingTop = '40px';
        } else {
            console.log('[定位] localhost HTTP 连接，部分浏览器仍支持定位');
        }
    } else {
        console.log('[定位] ✅ 环境正常 (HTTPS/安全上下文)');
    }

    // 特殊环境提示
    if (envCheck.isWeChat) {
        console.warn('[定位] 检测到微信内置浏览器，建议在外部浏览器中使用定位功能');
    }

    checkLocationPermission().then(status => { console.log('初始定位权限状态:', status); });

    // 绑定事件
    const searchBtn=document.getElementById('search-btn');
    const searchInput=document.getElementById('search-input');
    const navigateBtn=document.getElementById('navigate-btn');
    const realtimeNavBtn=document.getElementById('realtime-nav-btn');
    const locateBtn=document.getElementById('locate-btn');
    const followBtn=document.getElementById('follow-btn');
    const startInput=document.getElementById('start-input');
    const endInput=document.getElementById('end-input');

    if(searchBtn)searchBtn.addEventListener('click',searchBuilding);
    if(searchInput)searchInput.addEventListener('keypress',e=>{if(e.key==='Enter')searchBuilding();});
    if(navigateBtn)navigateBtn.addEventListener('click',navigateLocal);
    if(realtimeNavBtn)realtimeNavBtn.addEventListener('click',()=>{
        if(isRealTimeNavigating)stopRealTimeNavigation();else startRealTimeNavigation();
    });
    if(locateBtn)locateBtn.addEventListener('click',useCurrentLocation);
    if(followBtn)followBtn.addEventListener('click',toggleFollowMode);
    if(startInput)startInput.addEventListener('keypress',e=>{if(e.key==='Enter')navigateLocal();});
    if(endInput)endInput.addEventListener('keypress',e=>{if(e.key==='Enter')navigateLocal();});

    document.querySelectorAll('.tab-btn').forEach(btn=>{
        btn.addEventListener('click',()=>switchTab(btn.getAttribute('data-tab')));
    });

    const handle=document.getElementById('panel-handle');
    if(handle)handle.addEventListener('click',()=>{
        const panel=document.getElementById('control-panel');
        if(panel)panel.classList.toggle('open');
    });
    // 移动端面板拖拽初始化
    initPanelTouchDrag();

    // 优化移动端触摸响应：去除按钮点击延迟、防止双击缩放
    if (isMobile) {
        document.querySelectorAll('button, .building-item, .nav-btn').forEach(el => {
            el.style.touchAction = 'manipulation';
            el.style.userSelect = 'none';
            el.style.webkitTapHighlightColor = 'transparent';
        });
        // 监听面板状态变化后更新地图尺寸和导航面板位置
        const panelEl = document.getElementById('control-panel');
        if (panelEl) {
            const observer = new MutationObserver(() => {
                setTimeout(() => { if (map) map.invalidateSize(); }, 350);
            });
            observer.observe(panelEl, { attributes: true, attributeFilter: ['class'] });
        }
    }

    const locStatusClose=document.getElementById('loc-status-close');
    if(locStatusClose)locStatusClose.addEventListener('click',hideLocationStatus);

    if(startInput)startInput.value='正门';
    if(endInput)endInput.value='图书馆';

    console.log('校园导航系统初始化完成（静态版）');
});

// ==================== 导出全局函数 ====================
window.setAsStart=setAsStart;window.setAsEnd=setAsEnd;window.useCurrentLocation=useCurrentLocation;
window.navigate=navigate;window.quickNavigate=quickNavigate;window.closeQuickNav=closeQuickNav;
window.togglePanel=togglePanel;window.locateUser=locateUser;window.switchTab=switchTab;
window.resetNorth=resetNorth;window.startRealTimeNavigation=startRealTimeNavigation;
window.stopRealTimeNavigation=stopRealTimeNavigation;window.toggleFollowMode=toggleFollowMode;
