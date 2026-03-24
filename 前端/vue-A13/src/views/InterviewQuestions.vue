<template>
  <Transition name="page-enter" appear>
    <div class="interview-questions">
      <!-- Page Header - Dark Blue Theme -->
      <section class="page-header">
        <div class="page-header-bg">
          <div class="page-header-pattern"></div>
        </div>
        <div class="page-header-particles">
          <div class="page-header-particle"></div>
          <div class="page-header-particle"></div>
          <div class="page-header-particle"></div>
          <div class="page-header-particle"></div>
          <div class="page-header-particle"></div>
          <div class="page-header-particle"></div>
          <div class="page-header-particle"></div>
          <div class="page-header-particle"></div>
          <div class="page-header-particle"></div>
          <div class="page-header-particle"></div>
        </div>
        <div class="page-header-energy"></div>
        <div class="page-header-content">
          <span class="page-badge">💼 面试准备</span>
          <h1 class="page-title">职业面试问题</h1>
          <p class="page-subtitle">根据您的职业匹配度，获取个性化的面试问题和答案建议</p>
        </div>
      </section>

      <!-- Job Selection -->
      <section class="job-selection">
        <div class="container">
          <h2>人岗匹配结果</h2>
          <p>根据您的个人特质和技能，以下是最匹配的职业</p>
          <div class="job-buttons">
            <button 
              v-for="job in matchResults" 
              :key="job.id"
              class="job-btn"
              :class="{ active: selectedJob === job.id }"
              @click="selectJob(job.id)"
            >
              {{ job.title }}
              <span class="match-score">{{ job.score }}%</span>
            </button>
          </div>
        </div>
      </section>

      <!-- Interview Questions -->
      <section v-if="selectedJob" class="questions-container">
        <div class="container">
          <div class="questions-header">
            <h2>面试问题</h2>
            <p>针对 {{ getSelectedJobTitle() }} 职位的常见面试问题</p>
          </div>
          
          <div class="questions-list">
            <div 
              v-for="(question, index) in interviewQuestions" 
              :key="index"
              class="question-card"
              @click="toggleQuestion(index)"
            >
              <div class="question-header">
                <span class="question-number">{{ index + 1 }}</span>
                <h3>{{ question.question }}</h3>
                <span class="toggle-icon" :class="{ 'rotated': expandedQuestions.has(index) }">
                  ▼
                </span>
              </div>
              <div class="question-content">
                <div class="question-type">{{ question.type }}</div>
                <div class="answer-hint">
                  <h4>回答建议：</h4>
                  <p>{{ question.answerHint }}</p>
                </div>
                <div 
                  class="detailed-analysis" 
                  :class="{ 'expanded': expandedQuestions.has(index) }"
                >
                  <h4>详细解析：</h4>
                  <p>{{ question.detailedAnalysis }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- No Job Selected -->
      <section v-else class="no-selection">
        <div class="container">
          <div class="no-selection-content">
            <div class="icon">💡</div>
            <h2>请选择一个职业</h2>
            <p>从上方选择一个职业，获取相关的面试问题和答案建议</p>
          </div>
        </div>
      </section>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// 人岗匹配结果
const matchResults = ref([
  { id: 1, title: '前端开发工程师', score: 92 },
  { id: 2, title: '后端开发工程师', score: 85 },
  { id: 3, title: '数据分析师', score: 78 },
  { id: 4, title: '产品经理', score: 72 },
  { id: 5, title: 'UI设计师', score: 65 },
  { id: 6, title: 'DevOps工程师', score: 60 }
])

// 选中的职业
const selectedJob = ref<number | null>(null)

// 面试问题数据
const interviewQuestions = ref<any[]>([])

// 展开的问题ID
const expandedQuestions = ref<Set<number>>(new Set())

// 选择职业
const selectJob = (jobId: number) => {
  selectedJob.value = jobId
  expandedQuestions.value.clear() // 重置展开状态
  // 根据选择的职业获取面试问题
  fetchInterviewQuestions(jobId)
}

// 切换问题展开状态
const toggleQuestion = (index: number) => {
  if (expandedQuestions.value.has(index)) {
    expandedQuestions.value.delete(index)
  } else {
    expandedQuestions.value.add(index)
  }
}

// 获取选中的职业名称
const getSelectedJobTitle = () => {
  if (!selectedJob.value) return ''
  const job = matchResults.value.find(j => j.id === selectedJob.value)
  return job ? job.title : ''
}

// 模拟获取面试问题
const fetchInterviewQuestions = (jobId: number) => {
  // 这里可以替换为实际的API调用
  const questionsMap: Record<number, any[]> = {
    1: [
      {
        question: '请解释什么是Vue的响应式原理？',
        type: '技术问题',
        answerHint: 'Vue的响应式原理基于Object.defineProperty()或Proxy，通过 getter/setter 追踪依赖，当数据变化时自动更新视图。',
        detailedAnalysis: 'Vue的响应式系统是其核心特性之一，它使得开发者可以专注于数据的变化，而无需手动操作DOM。在Vue 2中，使用Object.defineProperty()来实现响应式，而在Vue 3中，则使用了更现代的Proxy API。当数据被访问时，会触发getter函数进行依赖收集；当数据被修改时，会触发setter函数通知依赖更新。这种设计使得Vue能够高效地追踪数据变化并更新视图，同时也支持计算属性、监听器等高级特性。'
      },
      {
        question: '如何优化前端性能？',
        type: '技术问题',
        answerHint: '可以从代码分割、懒加载、缓存策略、减少DOM操作、使用Web Workers等方面进行优化。',
        detailedAnalysis: '前端性能优化是一个综合性的工作，需要从多个维度入手。首先，代码分割和懒加载可以减少初始加载时间，只加载当前页面所需的资源。其次，合理的缓存策略可以减少重复请求，提高资源加载速度。此外，减少DOM操作、使用虚拟DOM、优化CSS选择器等可以提高渲染性能。对于复杂的计算任务，可以考虑使用Web Workers在后台线程中处理，避免阻塞主线程。最后，合理使用CDN、压缩资源、启用HTTP/2等也是提高前端性能的重要手段。'
      },
      {
        question: '请解释什么是闭包？',
        type: '技术问题',
        answerHint: '闭包是指有权访问另一个函数作用域中变量的函数，它可以帮助我们实现私有变量和模块化。',
        detailedAnalysis: '闭包是JavaScript中的一个重要概念，它允许函数访问其外部作用域中的变量，即使外部函数已经执行完毕。闭包的形成需要满足三个条件：1. 有函数嵌套；2. 内部函数引用了外部函数的变量；3. 内部函数在外部函数执行完毕后仍然可以被访问。闭包的主要应用场景包括：实现私有变量和方法、创建函数工厂、实现模块化等。需要注意的是，过度使用闭包可能会导致内存泄漏，因为闭包会保持对外部变量的引用，使它们不会被垃圾回收。'
      }
    ],
    2: [
      {
        question: '请解释什么是RESTful API？',
        type: '技术问题',
        answerHint: 'RESTful API是一种设计风格，它使用HTTP方法来操作资源，通过URL来标识资源，具有无状态、缓存、分层系统等特点。',
        detailedAnalysis: 'REST（Representational State Transfer）是一种软件架构风格，用于设计网络应用程序接口。RESTful API遵循以下原则：1. 资源标识：通过URL唯一标识资源；2. 统一接口：使用标准的HTTP方法（GET、POST、PUT、DELETE等）操作资源；3. 无状态：服务器不存储客户端的状态信息；4. 缓存：支持缓存机制，提高性能；5. 分层系统：通过分层架构提高系统的可扩展性；6. 按需编码：允许客户端下载并执行服务器端代码。RESTful API设计简洁、可扩展，是目前最流行的API设计风格之一。'
      },
      {
        question: '如何处理并发请求？',
        type: '技术问题',
        answerHint: '可以使用锁、信号量、队列等机制来处理并发请求，确保数据的一致性。',
        detailedAnalysis: '并发请求处理是后端开发中的重要问题，主要涉及到数据一致性和系统性能。常见的处理机制包括：1. 锁机制：如悲观锁和乐观锁，用于防止多个请求同时修改同一资源；2. 信号量：用于控制对资源的访问数量；3. 队列：将请求排队处理，确保顺序执行；4. 事务：通过ACID特性确保数据操作的原子性、一致性、隔离性和持久性；5. 分布式锁：在分布式系统中协调多个节点的操作。选择合适的并发处理机制需要根据具体的业务场景和系统架构来决定。'
      },
      {
        question: '请解释什么是数据库索引？',
        type: '技术问题',
        answerHint: '数据库索引是一种数据结构，它可以提高数据库查询的速度，通过减少需要扫描的数据量来优化查询性能。',
        detailedAnalysis: '数据库索引是为了提高查询效率而创建的数据结构，它类似于书籍的目录，可以快速定位到需要的数据。索引的工作原理是通过构建B树、B+树等数据结构，将数据的关键字与物理存储位置关联起来。当执行查询时，数据库系统可以通过索引快速定位到目标数据，而无需扫描整个表。索引的优点是显著提高查询速度，但缺点是会增加数据插入、更新和删除的开销，因为需要维护索引结构。因此，在设计数据库时，需要根据查询频率和数据修改频率来合理创建索引。'
      }
    ],
    3: [
      {
        question: '请解释什么是数据清洗？',
        type: '技术问题',
        answerHint: '数据清洗是指对原始数据进行处理，去除噪声、填充缺失值、纠正错误等，确保数据的质量和可用性。',
        detailedAnalysis: '数据清洗是数据预处理的重要环节，旨在提高数据质量，为后续的分析和建模做准备。数据清洗的主要任务包括：1. 去除重复数据：避免数据冗余；2. 处理缺失值：可以通过删除、填充（均值、中位数、众数等）或插值等方法处理；3. 纠正错误数据：识别并修正异常值、拼写错误等；4. 标准化数据：将数据转换为统一的格式和单位；5. 处理不一致数据：确保数据的一致性和准确性。数据清洗的质量直接影响到后续分析结果的可靠性，因此需要认真对待。'
      },
      {
        question: '如何处理大规模数据集？',
        type: '技术问题',
        answerHint: '可以使用分布式计算框架、数据采样、特征选择等方法来处理大规模数据集。',
        detailedAnalysis: '处理大规模数据集需要考虑计算资源、处理速度和存储成本等因素。常见的处理方法包括：1. 分布式计算框架：如Hadoop、Spark等，可以将计算任务分布到多个节点上并行处理；2. 数据采样：通过随机采样或分层采样，从大规模数据中获取代表性样本进行分析；3. 特征选择：选择最相关的特征，减少数据维度，提高处理效率；4. 数据压缩：使用压缩算法减少数据存储和传输成本；5. 增量处理：对数据进行增量处理，避免一次性处理全部数据；6. 使用内存计算：利用内存数据库或缓存技术，提高数据访问速度。选择合适的处理方法需要根据数据的特点、处理需求和可用资源来决定。'
      },
      {
        question: '请解释什么是机器学习模型的过拟合？',
        type: '技术问题',
        answerHint: '过拟合是指模型在训练数据上表现很好，但在测试数据上表现很差的现象，通常是因为模型过于复杂，学习了训练数据中的噪声。',
        detailedAnalysis: '过拟合是机器学习中常见的问题，它发生在模型学习了训练数据中的噪声和细节，而不是数据的内在规律。过拟合的主要表现是模型在训练集上的准确率很高，但在测试集上的准确率很低。导致过拟合的原因包括：1. 模型过于复杂：参数过多，能力过强；2. 训练数据不足：无法覆盖所有可能的情况；3. 训练数据噪声过大：模型学习了错误的模式。防止过拟合的方法包括：1. 正则化：如L1、L2正则化，限制模型参数的大小；2. 交叉验证：使用验证集评估模型性能，及时发现过拟合；3. 数据增强：通过增加训练数据的多样性，减少过拟合；4. 早停：在验证集性能开始下降时停止训练；5. 集成学习：结合多个模型的预测，减少过拟合的风险。'
      }
    ],
    4: [
      {
        question: '请解释什么是产品生命周期？',
        type: '业务问题',
        answerHint: '产品生命周期包括产品的构思、设计、开发、测试、发布、运营和下线等阶段，每个阶段都有不同的目标和任务。',
        detailedAnalysis: '产品生命周期（Product Life Cycle）是指产品从概念到退出市场的全过程，通常包括以下阶段：1. 概念阶段：识别市场需求，提出产品概念；2. 设计阶段：进行产品设计，确定产品功能和特性；3. 开发阶段：实现产品功能，进行代码开发和集成；4. 测试阶段：进行功能测试、性能测试、用户测试等，确保产品质量；5. 发布阶段：将产品推向市场，进行营销和推广；6. 运营阶段：收集用户反馈，持续优化产品，增加用户粘性；7. 下线阶段：当产品不再满足市场需求时，逐步退出市场。了解产品生命周期有助于产品经理更好地规划和管理产品，确保产品的成功。'
      },
      {
        question: '如何进行用户需求分析？',
        type: '业务问题',
        answerHint: '可以通过用户访谈、问卷调查、数据分析等方法来了解用户需求，然后进行整理和优先级排序。',
        detailedAnalysis: '用户需求分析是产品开发的基础，它帮助产品团队理解用户的真实需求，为产品设计提供依据。有效的需求分析过程包括：1. 收集需求：通过用户访谈、问卷调查、用户反馈、市场调研等方法收集原始需求；2. 整理需求：对收集到的需求进行分类、整理和归纳，去除重复和无效的需求；3. 分析需求：评估需求的可行性、优先级和价值，确定哪些需求应该被实现；4. 验证需求：通过原型设计、用户测试等方法验证需求的正确性和合理性；5. 文档化需求：将需求以规范的格式记录下来，作为产品开发的依据。需求分析是一个迭代的过程，需要持续关注用户需求的变化，及时调整产品策略。'
      },
      {
        question: '请解释什么是MVP？',
        type: '业务问题',
        answerHint: 'MVP（Minimum Viable Product）是指最小可行产品，它包含产品的核心功能，用于验证产品假设和获取用户反馈。',
        detailedAnalysis: 'MVP（最小可行产品）是精益创业中的重要概念，它是指包含产品核心功能的最小版本，用于快速验证产品假设和获取用户反馈。MVP的特点是：1. 只包含核心功能：专注于解决用户最迫切的问题；2. 开发周期短：快速上线，减少时间和资源投入；3. 用于验证假设：通过实际用户反馈验证产品方向是否正确；4. 为迭代提供依据：根据用户反馈持续优化产品。MVP的价值在于降低产品失败的风险，避免在错误的方向上投入过多资源。成功的MVP应该能够吸引早期用户，收集有价值的反馈，并为产品的后续发展奠定基础。'
      }
    ],
    5: [
      {
        question: '请解释什么是设计系统？',
        type: '设计问题',
        answerHint: '设计系统是一套包含设计原则、组件库、设计规范等的集合，它可以确保产品设计的一致性和可维护性。',
        detailedAnalysis: '设计系统是一个完整的设计资源集合，旨在确保产品设计的一致性、可扩展性和可维护性。它通常包括以下组成部分：1. 设计原则：指导设计决策的核心价值观和准则；2. 设计语言：包括颜色、 typography、图标、间距等基础设计元素；3. 组件库：可复用的UI组件，如按钮、表单、卡片等；4. 设计规范：详细的设计指南，包括组件的使用方法、交互规则等；5. 设计工具：用于创建和维护设计系统的工具和资源。设计系统的价值在于：1. 提高设计效率：设计师可以直接使用现成的组件和规范；2. 确保一致性：不同页面和功能的设计保持统一；3. 简化协作：设计师和开发人员使用共同的语言和资源；4. 降低维护成本：统一的设计系统便于后续的更新和维护。'
      },
      {
        question: '如何进行用户界面设计？',
        type: '设计问题',
        answerHint: '可以通过用户研究、竞品分析、原型设计、用户测试等方法来进行用户界面设计，确保设计符合用户需求和使用习惯。',
        detailedAnalysis: '用户界面设计是一个以用户为中心的过程，旨在创建直观、易用、美观的界面。有效的UI设计流程包括：1. 用户研究：了解用户的需求、行为和偏好；2. 竞品分析：研究竞争对手的设计，学习优点，避免缺点；3. 信息架构：设计清晰的信息层级和导航结构；4. 原型设计：创建低保真或高保真原型，验证设计方案；5. 用户测试：通过用户测试收集反馈，发现问题并改进；6. 视觉设计：确定颜色、排版、图标等视觉元素，创建统一的视觉风格；7. 交互设计：设计流畅的用户交互流程，确保操作直观易懂。UI设计需要平衡美观性和实用性，以用户体验为核心，创造既好看又好用的界面。'
      },
      {
        question: '请解释什么是响应式设计？',
        type: '设计问题',
        answerHint: '响应式设计是指设计能够根据不同设备的屏幕尺寸和分辨率自动调整布局和内容，提供良好的用户体验。',
        detailedAnalysis: '响应式设计是一种设计方法，旨在使网站或应用在不同设备上都能提供良好的用户体验。它的核心原则是：1. 流动布局：使用相对单位（如百分比）而不是固定单位，使布局能够适应不同的屏幕尺寸；2. 灵活图像：确保图像能够根据容器大小自动调整；3. 媒体查询：根据设备的屏幕尺寸、方向等特性应用不同的CSS样式；4. 断点设计：在特定的屏幕尺寸处设置断点，调整布局结构；5. 移动优先：从移动设备的设计开始，逐步扩展到更大的屏幕。响应式设计的优点是：1. 提高用户体验：在任何设备上都能获得良好的浏览体验；2. 减少维护成本：只需要维护一个代码库；3. 提高SEO：谷歌等搜索引擎更倾向于排名响应式网站；4. 适应未来设备：能够适应新出现的设备和屏幕尺寸。'
      }
    ],
    6: [
      {
        question: '请解释什么是CI/CD？',
        type: '技术问题',
        answerHint: 'CI/CD（Continuous Integration/Continuous Deployment）是一种开发实践，它通过自动化构建、测试和部署，提高开发效率和代码质量。',
        detailedAnalysis: 'CI/CD（持续集成/持续部署）是现代软件开发中的重要实践，旨在自动化软件交付过程，提高开发效率和代码质量。持续集成（CI）是指开发人员频繁地将代码集成到共享仓库中，每次集成都会自动运行构建和测试，确保代码的质量。持续部署（CD）是指将通过测试的代码自动部署到生产环境，减少手动操作，加快交付速度。CI/CD的主要组件包括：1. 版本控制系统：如Git，用于管理代码；2. 构建工具：如Jenkins、GitHub Actions，用于自动化构建过程；3. 测试工具：用于运行自动化测试；4. 部署工具：用于自动化部署过程。实施CI/CD可以带来以下好处：1. 减少手动错误：自动化流程减少了人为错误；2. 提高开发效率：开发人员可以专注于编写代码，而不是手动构建和部署；3. 加快交付速度：代码可以更快地部署到生产环境；4. 提高代码质量：频繁的测试和集成可以及早发现问题。'
      },
      {
        question: '如何确保系统的高可用性？',
        type: '技术问题',
        answerHint: '可以通过冗余设计、负载均衡、故障转移、监控告警等方法来确保系统的高可用性。',
        detailedAnalysis: '系统高可用性是指系统能够在较长时间内保持正常运行，减少停机时间。确保高可用性的主要策略包括：1. 冗余设计：通过多副本部署，确保单点故障不会导致整个系统瘫痪；2. 负载均衡：将流量分发到多个服务器，避免单台服务器过载；3. 故障转移：当主系统出现故障时，自动切换到备用系统；4. 监控告警：实时监控系统状态，及时发现并处理异常；5. 灾难恢复：制定详细的灾难恢复计划，确保在发生重大故障时能够快速恢复系统；6. 定期备份：定期备份数据，防止数据丢失；7. 容量规划：根据业务增长趋势，提前规划系统容量，避免资源不足。高可用性设计需要在成本和可用性之间找到平衡，根据业务的重要性和对可用性的要求来选择合适的策略。'
      },
      {
        question: '请解释什么是容器化？',
        type: '技术问题',
        answerHint: '容器化是指将应用程序及其依赖打包成一个容器，使其可以在不同的环境中一致运行，提高部署的可靠性和效率。',
        detailedAnalysis: '容器化是一种虚拟化技术，它将应用程序及其所有依赖（如库、运行时环境等）打包成一个独立的容器，使其可以在任何支持容器的环境中一致运行。与传统的虚拟机相比，容器更加轻量级，启动速度更快，资源占用更少。容器化的主要优势包括：1. 一致性：容器在开发、测试和生产环境中运行结果一致，减少了环境差异导致的问题；2. 隔离性：每个容器都有自己的文件系统和网络空间，相互隔离；3. 可移植性：容器可以在任何支持容器的平台上运行；4. 资源效率：容器共享主机的操作系统内核，资源占用少；5. 快速部署：容器可以在几秒内启动，加快部署速度；6. 版本控制：容器镜像可以进行版本管理，方便回滚和升级。Docker是目前最流行的容器化平台，它提供了完整的容器创建、管理和分发工具。容器化已经成为现代DevOps实践的重要组成部分，它与CI/CD流程相结合，可以显著提高软件交付的速度和质量。'
      }
    ]
  }
  
  interviewQuestions.value = questionsMap[jobId] || []
}
</script>

<style scoped>
/* Page Enter Animation */
.page-enter-enter-active {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-enter-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.page-enter-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.interview-questions {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

/* Page Header - Dark Blue Theme */
.page-header {
  position: relative;
  background: linear-gradient(135deg, #1a237e 0%, #283593 30%, #3949ab 60%, #3f51b5 100%);
  color: white;
  padding: 1.33rem 0;
  margin: -2rem -2rem 2rem 0rem;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 100%;
}

.page-header-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.page-header-pattern {
  position: absolute;
  inset: 0;
  background-image: 
    radial-gradient(circle at 20% 80%, rgba(102, 126, 234, 0.4) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(118, 75, 162, 0.4) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(240, 147, 251, 0.2) 0%, transparent 50%);
  animation: patternFloat 10s ease-in-out infinite;
}

@keyframes patternFloat {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.8;
  }
  50% {
    transform: translate(-15px, 10px) scale(1.05);
    opacity: 1;
  }
}

.page-header::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(45deg, 
    transparent 30%, 
    rgba(255, 255, 255, 0.05) 50%, 
    transparent 70%);
  animation: shimmer 4s ease-in-out infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* 添加粒子效果 */
.page-header-particles {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.page-header-particle {
  position: absolute;
  width: 3px;
  height: 3px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: headerParticleFloat 6s ease-in-out infinite;
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.8);
}

.page-header-particle:nth-child(1) { left: 5%; top: 30%; animation-delay: 0s; }
.page-header-particle:nth-child(2) { left: 15%; top: 70%; animation-delay: 0.8s; }
.page-header-particle:nth-child(3) { left: 25%; top: 50%; animation-delay: 1.5s; }
.page-header-particle:nth-child(4) { left: 35%; top: 80%; animation-delay: 0.3s; }
.page-header-particle:nth-child(5) { left: 45%; top: 40%; animation-delay: 2s; }
.page-header-particle:nth-child(6) { left: 55%; top: 60%; animation-delay: 1s; }
.page-header-particle:nth-child(7) { left: 65%; top: 30%; animation-delay: 2.5s; }
.page-header-particle:nth-child(8) { left: 75%; top: 70%; animation-delay: 0.5s; }
.page-header-particle:nth-child(9) { left: 85%; top: 50%; animation-delay: 1.8s; }
.page-header-particle:nth-child(10) { left: 95%; top: 80%; animation-delay: 1.2s; }

@keyframes headerParticleFloat {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-15px) scale(1.3);
    opacity: 0.9;
  }
}

/* 添加能量环 */
.page-header-energy {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: energyRing 4s ease-out infinite;
}

.page-header-energy::before,
.page-header-energy::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 50%;
}

.page-header-energy::before {
  width: 300px;
  height: 300px;
  animation: energyRing 4s ease-out infinite 0.5s;
}

.page-header-energy::after {
  width: 400px;
  height: 400px;
  animation: energyRing 4s ease-out infinite 1s;
}

@keyframes energyRing {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0.5;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 0;
  }
}

.page-header-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  padding: 0 2rem;
}

.page-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  padding: 0.3rem 0.8rem;
  border-radius: 50px;
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.page-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  line-height: 1.2;
}

.page-subtitle {
  font-size: 1rem;
  opacity: 0.9;
  margin: 0;
}

/* Job Selection */
.job-selection {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid #e2e8f0;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
}

.job-selection h2 {
  margin-top: 0;
  color: #1e293b;
  font-size: 1.5rem;
}

.job-selection p {
  color: #64748b;
  margin-bottom: 1.5rem;
}

.job-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.job-btn {
  padding: 0.75rem 1.5rem;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  color: #475569;
}

.job-btn:hover {
  border-color: #1a237e;
  color: #1a237e;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(26, 35, 126, 0.2);
}

.job-btn.active {
  background: #1a237e;
  color: white;
  border-color: #1a237e;
}

/* Questions Container */
.questions-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid #e2e8f0;
}

.questions-header h2 {
  margin-top: 0;
  color: #1e293b;
  font-size: 1.5rem;
}

.questions-header p {
  color: #64748b;
  margin-bottom: 1.5rem;
}

.questions-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}



.question-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

.question-card {
  background: #f8fafc;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  cursor: pointer;
}

.question-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #1a237e;
}

.question-number {
  width: 32px;
  height: 32px;
  background: #1a237e;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  flex-shrink: 0;
}

.question-header h3 {
  margin: 0;
  color: #1e293b;
  font-size: 1.1rem;
  flex: 1;
}

.toggle-icon {
  font-size: 0.8rem;
  color: #64748b;
  transition: transform 0.3s ease;
  flex-shrink: 0;
  margin-top: 0.25rem;
}

.toggle-icon.rotated {
  transform: rotate(180deg);
}

.detailed-analysis {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.detailed-analysis.expanded {
  max-height: 500px;
}

.detailed-analysis h4 {
  margin: 0 0 0.5rem 0;
  color: #475569;
  font-size: 0.9rem;
}

.detailed-analysis p {
  margin: 0;
  color: #64748b;
  line-height: 1.6;
}

.question-content {
  margin-left: 42px;
}

.question-type {
  background: rgba(26, 35, 126, 0.1);
  color: #1a237e;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  display: inline-block;
  margin-bottom: 1rem;
}

.answer-hint h4 {
  margin: 0 0 0.5rem 0;
  color: #475569;
  font-size: 0.9rem;
}

.answer-hint p {
  margin: 0;
  color: #64748b;
  line-height: 1.6;
}

/* No Selection */
.no-selection {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 4rem 2rem;
  margin-bottom: 2rem;
  border: 1px solid #e2e8f0;
}

.no-selection-content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.no-selection-content .icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
}

.no-selection-content h2 {
  margin: 0 0 0.5rem 0;
  color: #1e293b;
  font-size: 1.5rem;
}

.no-selection-content p {
  margin: 0;
  color: #64748b;
  font-size: 1.1rem;
}

/* Responsive */
@media (min-width: 1200px) {
  .page-title {
    font-size: 3rem;
  }
}

@media (max-width: 992px) {
  .page-header {
    padding: 3rem 1.5rem;
    margin: -1.5rem -1.5rem 1.5rem -1.5rem;
  }

  .page-title {
    font-size: 2.25rem;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 1.75rem;
  }

  .job-selection,
  .questions-container,
  .no-selection {
    padding: 1.5rem;
  }

  .job-buttons {
    flex-direction: column;
  }

  .job-btn {
    width: 100%;
    text-align: left;
  }

  .question-content {
    margin-left: 0;
  }

  .question-header {
    flex-direction: column;
    gap: 0.5rem;
  }

  .question-number {
    align-self: flex-start;
  }
}
</style>