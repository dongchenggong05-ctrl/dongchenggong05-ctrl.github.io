window.profileData = {
  profile: {
    title: "AI Creative Builder",
    goal: "成为 AI 创意落地型创意策划 / 创意总监",
    intro:
      "我正在从创意表达、AIGC 内容制作、视觉实验和 Codex 小工具四个方向积累作品证据，把想法变成能展示、能复盘、能继续商业验证的项目。",
    aboutCards: [
      {
        title: "当前定位",
        text: "偏创意型的 AI Creative Builder，重点做 AIGC、内容创作、视觉表达和创意策划落地。"
      },
      {
        title: "第一阶段目标",
        text: "先做作品证据，再做商业验证，再补系统学习输入。"
      },
      {
        title: "主页作用",
        text: "把作品、项目、实验和行业输出整理成成长型简历，让别人快速看到持续积累的证据。"
      }
    ]
  },
  xpRules: {
    video: 5,
    codex: 15,
    visual: 8,
    insight: 5,
    caseStudy: 20
  },
  mainGoal: {
    label: "主线成长进度",
    targetXp: 1500
  },
  growthStages: [
    {
      title: "工具熟悉期",
      minXp: 0
    },
    {
      title: "稳定输出期",
      minXp: 120
    },
    {
      title: "作品积累期",
      minXp: 320
    },
    {
      title: "案例成型期",
      minXp: 700
    },
    {
      title: "商业验证期",
      minXp: 1150
    }
  ],
  taskTypes: {
    light: {
      title: "轻练习",
      baseXp: 5
    },
    output: {
      title: "输出任务",
      baseXp: 10
    },
    work: {
      title: "作品任务",
      baseXp: 30
    },
    project: {
      title: "项目任务",
      baseXp: 50
    },
    case: {
      title: "案例任务",
      baseXp: 80
    }
  },
  portfolioProjects: [
    {
      title: "个人创意主页 V1",
      type: "个人品牌 / 作品集 / 成长仪表盘",
      summary: "把个人定位、作品展示、成长记录和任务进度整合成一个可持续更新的创意主页。",
      status: "V0.8 可用性优化中",
      completedAt: "2026-05",
      nextStep: "补齐真实作品截图、案例说明和联系方式。"
    },
    {
      title: "五金仓库系统",
      type: "业务工具 / Codex 项目",
      summary: "面向真实库存管理场景，规划可查询、可记录、可持续扩展的小型业务系统。",
      status: "需求整理中",
      completedAt: "规划阶段",
      nextStep: "先做最小库存表、入库出库记录和搜索功能。"
    },
    {
      title: "AIGC 视觉实验 / 视频项目",
      type: "AIGC 视觉 / 视频创作",
      summary: "围绕提示词、画面风格、分镜和视频表达进行持续实验，沉淀可展示的视觉作品。",
      status: "持续实验中",
      completedAt: "持续更新",
      nextStep: "选 3 个最稳定的视觉方向，整理成作品案例。"
    }
  ],
  plannedTasks: [
    {
      id: "mj-light-practice",
      title: "今日 MJ 轻练习",
      mainGoal: "成为 AI 创意落地型创意策划 / 创意总监",
      capabilityModule: "视觉表达实验",
      description: "完成一次轻量视觉提示词练习，重点记录画面方向和问题。",
      plannedDate: "auto:today",
      cycleType: "每日",
      taskType: "light",
      xp: 5,
      track: "visual",
      module: "视觉表达经验",
      status: "未完成",
      canBecomeWork: false
    },
    {
      id: "aigc-image-practice",
      title: "生成 1 张 AIGC 练习图",
      mainGoal: "成为 AI 创意落地型创意策划 / 创意总监",
      capabilityModule: "AIGC 实验",
      description: "围绕一个明确主题生成一张图，并保留提示词和结果。",
      plannedDate: "auto:today",
      cycleType: "每日",
      taskType: "light",
      xp: 5,
      track: "visual",
      module: "AIGC 实验经验",
      status: "未完成",
      canBecomeWork: true
    },
    {
      id: "three-line-review",
      title: "写 3 句练习复盘",
      mainGoal: "成为 AI 创意落地型创意策划 / 创意总监",
      capabilityModule: "读书与行业输出",
      description: "用三句话记录今天的尝试、问题和下一步改法。",
      plannedDate: "auto:today",
      cycleType: "每日",
      taskType: "output",
      xp: 10,
      track: "insight",
      module: "作品沉淀经验",
      status: "未完成",
      canBecomeWork: false
    },
    {
      id: "archive-one-work",
      title: "整理 1 条作品归档",
      mainGoal: "成为 AI 创意落地型创意策划 / 创意总监",
      capabilityModule: "Codex 小工具",
      description: "把一个作品、实验或项目记录进归档，补齐说明和状态。",
      plannedDate: "auto:this-week",
      cycleType: "每周",
      taskType: "work",
      xp: 30,
      track: "codex",
      module: "项目进度经验",
      status: "未完成",
      canBecomeWork: true
    },
    {
      id: "case-study-outline",
      title: "整理 1 个案例雏形",
      mainGoal: "成为 AI 创意落地型创意策划 / 创意总监",
      capabilityModule: "完整案例",
      description: "把一个作品补成问题、方案、过程、结果四段式案例草稿。",
      plannedDate: "auto:this-week",
      cycleType: "每周",
      taskType: "case",
      xp: 80,
      track: "codex",
      module: "案例成型经验",
      status: "未完成",
      canBecomeWork: true
    }
  ],
  tracks: [
    {
      id: "video",
      title: "AIGC 视频作品",
      progressLabel: "作品积累进度",
      targetXp: 80,
      href: "./video-works.html",
      description: "沉淀能体现创意表达、分镜能力和成片落地能力的视频作品。"
    },
    {
      id: "codex",
      title: "Codex 小工具",
      progressLabel: "项目进度",
      targetXp: 90,
      href: "./codex-projects.html",
      description: "用最小可运行版本，把真实需求做成可展示、可迭代的小工具。"
    },
    {
      id: "visual",
      title: "AIGC 创意实验",
      progressLabel: "能力进度",
      targetXp: 80,
      href: "./aigc-experiments.html",
      description: "测试视觉风格、提示词结构、角色一致性和创意表达方法。"
    },
    {
      id: "insight",
      title: "读书与行业输出",
      progressLabel: "能力进度",
      targetXp: 50,
      href: "./insights.html",
      description: "记录 AI 创意、内容商业化、案例观察和个人判断。"
    }
  ],
  works: [
    {
      date: "2026-05-25",
      title: "个人创意主页第一版",
      type: "Codex 小工具",
      track: "codex",
      description: "用静态网页整理个人作品、成长记录和可展示简历信息。",
      status: "已完成",
      featured: true,
      isCaseStudy: true
    },
    {
      date: "2026-05-24",
      title: "创意主页结构升级",
      type: "Codex 小工具",
      track: "codex",
      description: "把首页升级为 Dashboard，总控台连接各个独立模块页。",
      status: "正在推进",
      featured: true
    },
    {
      date: "2026-05-18",
      title: "AIGC 视频分镜实验",
      type: "视频作品",
      track: "video",
      description: "把一句创意想法拆成镜头、画面、情绪和生成提示词。",
      status: "已完成",
      featured: true
    },
    {
      date: "2026-05-16",
      title: "未来感个人视觉风格测试",
      type: "AIGC 创意实验",
      track: "visual",
      description: "测试克制、清晰、有未来感的个人作品集视觉方向。",
      status: "已完成"
    },
    {
      date: "2026-05-12",
      title: "AI 创意行业观察笔记 01",
      type: "读书/行业输出",
      track: "insight",
      description: "记录 AI 创意落地案例、商业化方向和个人机会判断。",
      status: "已完成"
    }，
    {
    date:"2026-05-30",
      title:"五金仓库管理系统“，
      type:"AI工具落地"，
      track:"codex“，
      description:"从真实工作场景出发，用Ai和Codex辅助开发的本地仓库管理系统，解决出入库混乱、库存不清、部门统计难等问题。“，
      status:"已完成“，
      featured:true,
      isCaseStudy:true
    }
  ]
};
