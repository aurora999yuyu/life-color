// ============================================
// 照片数据
// 格式：{ date: "2026-03-22", imagePath: "photos/你的照片.jpg", description: "照片描述（可选）" }
// 注意：日期格式必须是 YYYY-MM-DD
// ============================================
const photosData = [
    {
        date: "2026-03-22",
        imagePath: "photos/example1.jpg",
        description: "午后阳光透过树叶"
    },
    {
        date: "2026-03-15",
        imagePath: "photos/example2.jpg",
        description: "路边偶遇的小花"
    },
    {
        date: "2026-02-28",
        imagePath: "photos/example3.jpg",
        description: "傍晚的云"
    }
];

// ============================================
// 心情数据
// 格式：{ date: "2026-03-22", color: "#FFD966", text: "心情文字（可选）", imagePath: "moods/配图.jpg（可选）" }
// 颜色可以用色值，比如 #FFD966（亮黄）、#6B8E23（深绿）、#FFA07A（浅橙）等，完全自由
// ============================================
const moodsData = [
    {
        date: "2026-03-22",
        color: "#FFD966",
        text: "今天完成了一件拖延很久的事，开心！",
        imagePath: "moods/happy1.jpg"
    },
    {
        date: "2026-03-21",
        color: "#8FBC8F",
        text: "安静地读了一下午书",
        imagePath: ""
    },
    {
        date: "2026-03-20",
        color: "#CD8C5C",
        text: "和朋友散步，聊了很多",
        imagePath: "moods/walk.jpg"
    }
];