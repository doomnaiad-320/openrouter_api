import React, { useContext, useEffect, useState } from 'react';
import { Button, Typography, Tag, Input, ScrollList, ScrollItem } from '@douyinfe/semi-ui';
import { API, showError, isMobile, copy, showSuccess } from '../../helpers';
import { API_ENDPOINTS } from '../../constants/common.constant';
import { StatusContext } from '../../context/Status';
import { marked } from 'marked';
import { useTranslation } from 'react-i18next';
import { IconGithubLogo, IconPlay, IconFile, IconCopy } from '@douyinfe/semi-icons';
import { Link } from 'react-router-dom';
import NoticeModal from '../../components/layout/NoticeModal';
import SEO from '../../components/SEO';
import { Moonshot, OpenAI, XAI, Zhipu, Volcengine, Cohere, Claude, Gemini, Suno, Minimax, Wenxin, Spark, Qingyan, DeepSeek, Qwen, Midjourney, Grok, AzureAI, Hunyuan, Xinference } from '@lobehub/icons';

const { Text } = Typography;

const Home = () => {
  const { t, i18n } = useTranslation();
  const [statusState] = useContext(StatusContext);
  const [homePageContentLoaded, setHomePageContentLoaded] = useState(false);
  const [homePageContent, setHomePageContent] = useState('');
  const [noticeVisible, setNoticeVisible] = useState(false);
  const isDemoSiteMode = statusState?.status?.demo_site_enabled || false;
  const docsLink = statusState?.status?.docs_link || '';
  const serverAddress = statusState?.status?.server_address || window.location.origin;
  const endpointItems = API_ENDPOINTS.map((e) => ({ value: e }));
  const [endpointIndex, setEndpointIndex] = useState(0);
  const isChinese = i18n.language.startsWith('zh');

  const displayHomePageContent = async () => {
    setHomePageContent(localStorage.getItem('home_page_content') || '');
    const res = await API.get('/api/home_page_content');
    const { success, message, data } = res.data;
    if (success) {
      let content = data;
      if (!data.startsWith('https://')) {
        content = marked.parse(data);
      }
      setHomePageContent(content);
      localStorage.setItem('home_page_content', content);

      // 如果内容是 URL，则发送主题模式
      if (data.startsWith('https://')) {
        const iframe = document.querySelector('iframe');
        if (iframe) {
          const theme = localStorage.getItem('theme-mode') || 'light';
          iframe.onload = () => {
            iframe.contentWindow.postMessage({ themeMode: theme }, '*');
            iframe.contentWindow.postMessage({ lang: i18n.language }, '*');
          };
        }
      }
    } else {
      showError(message);
      setHomePageContent('加载首页内容失败...');
    }
    setHomePageContentLoaded(true);
  };

  const handleCopyBaseURL = async () => {
    const ok = await copy(serverAddress);
    if (ok) {
      showSuccess(t('已复制到剪切板'));
    }
  };

  useEffect(() => {
    const checkNoticeAndShow = async () => {
      const lastCloseDate = localStorage.getItem('notice_close_date');
      const today = new Date().toDateString();
      if (lastCloseDate !== today) {
        try {
          const res = await API.get('/api/notice');
          const { success, data } = res.data;
          if (success && data && data.trim() !== '') {
            setNoticeVisible(true);
          }
        } catch (error) {
          console.error('获取公告失败:', error);
        }
      }
    };

    checkNoticeAndShow();
  }, []);

  useEffect(() => {
    displayHomePageContent().then();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setEndpointIndex((prev) => (prev + 1) % endpointItems.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [endpointItems.length]);

  return (
    <div className="w-full overflow-x-hidden">
      <SEO
        title={t('为您的 AI 应用注入无限动力')}
        description={t('我们提供专为虚拟角色聊天、开发者工具和高级 AI 应用设计的统一 API 网关，稳定、低价、高效。支持 OpenAI、Claude、Gemini 等多种顶尖模型。')}
        keywords="AI API,OpenAI API,Claude API,Gemini API,AI网关,人工智能接口,SillyTavern,虚拟角色聊天,开发者工具,API管理"
        url="/"
      />
      <NoticeModal
        visible={noticeVisible}
        onClose={() => setNoticeVisible(false)}
        isMobile={isMobile()}
      />
      {homePageContentLoaded && homePageContent === '' ? (
        <div className="w-full overflow-x-hidden">
          {/* Banner 部分 */}
          <div className="w-full border-b border-semi-color-border min-h-[500px] md:min-h-[600px] lg:min-h-[700px] relative overflow-x-hidden">
            {/* 背景模糊晕染球 */}
            <div className="blur-ball blur-ball-indigo" />
            <div className="blur-ball blur-ball-teal" />
            <div className="flex items-center justify-center h-full px-4 py-20 md:py-24 lg:py-32 mt-10">
              {/* 居中内容区 */}
              <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
                <div className="flex flex-col items-center justify-center mb-6 md:mb-8">
                  <h1 className={`text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-semi-color-text-0 leading-tight ${isChinese ? 'tracking-wide md:tracking-wider' : ''}`}>
                    {i18n.language === 'en' ? (
                      <>
                        The Unified<br />
                        <span className="shine-text">LLMs API Gateway</span>
                      </>
                    ) : (
                      <>
                        统一的<br />
                        <span className="shine-text">大模型接口网关</span>
                      </>
                    )}
                  </h1>
                  <p className="text-base md:text-lg lg:text-xl text-semi-color-text-1 mt-4 md:mt-6 max-w-xl">
                    {t('更好的价格，更好的稳定性，只需要将模型基址替换为：')}
                  </p>







                  {/* BASE URL 与端点选择 */}
                  <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full mt-4 md:mt-6 max-w-md">
                    <Input
                      readonly
                      value={serverAddress}
                      className="flex-1 !rounded-full"
                      size={isMobile() ? 'default' : 'large'}
                      suffix={
                        <div className="flex items-center gap-2">
                          <ScrollList bodyHeight={32} style={{ border: 'unset', boxShadow: 'unset' }}>
                            <ScrollItem
                              mode="wheel"
                              cycled={true}
                              list={endpointItems}
                              selectedIndex={endpointIndex}
                              onSelect={({ index }) => setEndpointIndex(index)}
                            />
                          </ScrollList>
                          <Button
                            type="primary"
                            onClick={handleCopyBaseURL}
                            icon={<IconCopy />}
                            className="!rounded-full"
                          />
                        </div>
                      }
                    />
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex flex-row gap-4 justify-center items-center">
                  <Link to="/console">
                    <Button theme="solid" type="primary" size={isMobile() ? "default" : "large"} className="!rounded-3xl px-8 py-2" icon={<IconPlay />}>
                      {t('获取密钥')}
                    </Button>
                  </Link>
                  {isDemoSiteMode && statusState?.status?.version ? (
                    <Button
                      size={isMobile() ? "default" : "large"}
                      className="flex items-center !rounded-3xl px-6 py-2"
                      icon={<IconGithubLogo />}
                      onClick={() => window.open('https://github.com/QuantumNous/new-api', '_blank')}
                    >
                      {statusState.status.version}
                    </Button>
                  ) : (
                    docsLink && (
                      <Button
                        size={isMobile() ? "default" : "large"}
                        className="flex items-center !rounded-3xl px-6 py-2"
                        icon={<IconFile />}
                        onClick={() => window.open(docsLink, '_blank')}
                      >
                        {t('文档')}
                      </Button>
                    )
                  )}
                </div>

                {/* 应用场景说明 */}
                <div className="mt-8 md:mt-10 max-w-4xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {/* 虚拟角色聊天 */}
                    <div className="bg-semi-color-bg-1 backdrop-blur-sm border border-semi-color-border rounded-2xl p-6 md:p-8 hover:shadow-lg transition-all duration-300 hover:scale-105">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
                          <span className="text-white text-xl">🎭</span>
                        </div>
                        <h3 className="text-lg md:text-xl font-semibold text-semi-color-text-0">
                          {t('虚拟角色聊天')}
                        </h3>
                      </div>
                      <p className="text-sm md:text-base text-semi-color-text-1 leading-relaxed">
                        {t('为 SillyTavern、Omate 等虚拟角色聊天应用提供优质的 Gemini、Claude API 接口，让您的 AI 角色更加生动智能。')}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-4">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">SillyTavern</span>
                        <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-medium">Omate</span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Gemini</span>
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">Claude</span>
                      </div>
                    </div>

                    {/* 开发者工具 */}
                    <div className="bg-semi-color-bg-1 backdrop-blur-sm border border-semi-color-border rounded-2xl p-6 md:p-8 hover:shadow-lg transition-all duration-300 hover:scale-105">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-4">
                          <span className="text-white text-xl">💻</span>
                        </div>
                        <h3 className="text-lg md:text-xl font-semibold text-semi-color-text-0">
                          {t('开发者工具')}
                        </h3>
                      </div>
                      <p className="text-sm md:text-base text-semi-color-text-1 leading-relaxed">
                        {t('为 Claude Code、Cline、Rook Code 等开发工具提供低价的 Claude Sonnet 4、Gemini 2.5 Pro，助力高效编程。')}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Claude Code</span>
                        <span className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs font-medium">Cline</span>
                        <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-medium">Rook Code</span>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Sonnet 4</span>
                      </div>
                    </div>
                  </div>

                  {/* 特色优势 */}
                  <div className="mt-8 md:mt-10 text-center">
                    <div className="inline-flex items-center gap-6 md:gap-8 px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        <span className="text-sm md:text-base font-medium text-semi-color-text-0">{t('稳定可靠')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                        <span className="text-sm md:text-base font-medium text-semi-color-text-0">{t('价格优惠')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                        <span className="text-sm md:text-base font-medium text-semi-color-text-0">{t('即插即用')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 功能对比区域 - 按照设计图样式 */}
                <div className="w-full max-w-5xl mt-12 md:mt-16">
                  <div className="mb-8 md:mb-12 text-center">
                    <h2 className="mb-4 text-2xl font-bold md:text-4xl text-semi-color-text-0">
                      {t('告别管理复杂性，开始交付功能。')}
                    </h2>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* 第一行：管理供应商关系 vs 单一API */}
                    <div className="bg-semi-color-bg-1 backdrop-blur-sm border border-semi-color-border rounded-xl p-6">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 flex items-center">
                          <div className="w-8 h-8 text-semi-color-text-1">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
                              <circle cx="12" cy="12" r="3"/>
                              <path d="M12 1v6m0 6v6"/>
                              <path d="m21 12-6-3-6 3-6-3"/>
                            </svg>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-start gap-2">
                            <span className="text-red-500 text-sm mt-1">✕</span>
                            <p className="font-medium text-semi-color-text-1">{t('管理 5 个以上供应商关系')}</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-green-500 text-sm mt-1">✓</span>
                            <p className="font-medium text-semi-color-text-0">{t('单一API，单一合同，统一计费')}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-semi-color-bg-1 backdrop-blur-sm border border-semi-color-border rounded-xl p-6">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 flex items-center">
                          <div className="w-8 h-8 text-semi-color-text-1">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
                              <polyline points="16 18 22 12 16 6"/>
                              <polyline points="8 6 2 12 8 18"/>
                            </svg>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-start gap-2">
                            <span className="text-red-500 text-sm mt-1">✕</span>
                            <p className="font-medium text-semi-color-text-1">{t('构建自定义重试逻辑')}</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-green-500 text-sm mt-1">✓</span>
                            <p className="font-medium text-semi-color-text-0">{t('提供商之间的自动故障转移')}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 第二行：容量限制 vs 智能路由 */}
                    <div className="bg-semi-color-bg-1 backdrop-blur-sm border border-semi-color-border rounded-xl p-6">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 flex items-center">
                          <div className="w-8 h-8 text-semi-color-text-1">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                              <polyline points="14,2 14,8 20,8"/>
                              <line x1="16" y1="13" x2="8" y2="13"/>
                              <line x1="16" y1="17" x2="8" y2="17"/>
                              <polyline points="10,9 9,9 8,9"/>
                            </svg>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-start gap-2">
                            <span className="text-red-500 text-sm mt-1">✕</span>
                            <p className="font-medium text-semi-color-text-1">{t('容量和速率限制')}</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-green-500 text-sm mt-1">✓</span>
                            <p className="font-medium text-semi-color-text-0">{t('当达到限制时，故障转移到我们的容量')}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-semi-color-bg-1 backdrop-blur-sm border border-semi-color-border rounded-xl p-6">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 flex items-center">
                          <div className="w-8 h-8 text-semi-color-text-1">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
                              <path d="M5.25 14.25h13.5m-13.5 0a3 3 0 0 1-3-3m3 3a3 3 0 1 0 0 6h13.5a3 3 0 1 0 0-6m-16.5-3a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3"/>
                              <circle cx="6" cy="17.25" r=".75"/>
                              <circle cx="18" cy="17.25" r=".75"/>
                            </svg>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-start gap-2">
                            <span className="text-red-500 text-sm mt-1">✕</span>
                            <p className="font-medium text-semi-color-text-1">{t('为每个新模型维护单独的代码')}</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-green-500 text-sm mt-1">✓</span>
                            <p className="font-medium text-semi-color-text-0">{t('模型间切换成本为零')}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 框架兼容性图标 */}
                <div className="mt-12 md:mt-16 lg:mt-20 w-full">
                  <div className="flex items-center mb-6 md:mb-8 justify-center">
                    <Text type="tertiary" className="text-lg md:text-xl lg:text-2xl font-light">
                      {t('支持众多的大模型供应商')}
                    </Text>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 max-w-5xl mx-auto px-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center">
                      <Moonshot size={40} />
                    </div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center">
                      <OpenAI size={40} />
                    </div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center">
                      <XAI size={40} />
                    </div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center">
                      <Zhipu.Color size={40} />
                    </div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center">
                      <Volcengine.Color size={40} />
                    </div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center">
                      <Cohere.Color size={40} />
                    </div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center">
                      <Claude.Color size={40} />
                    </div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center">
                      <Gemini.Color size={40} />
                    </div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center">
                      <Suno size={40} />
                    </div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center">
                      <Minimax.Color size={40} />
                    </div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center">
                      <Wenxin.Color size={40} />
                    </div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center">
                      <Spark.Color size={40} />
                    </div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center">
                      <Qingyan.Color size={40} />
                    </div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center">
                      <DeepSeek.Color size={40} />
                    </div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center">
                      <Qwen.Color size={40} />
                    </div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center">
                      <Midjourney size={40} />
                    </div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center">
                      <Grok size={40} />
                    </div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center">
                      <AzureAI.Color size={40} />
                    </div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center">
                      <Hunyuan.Color size={40} />
                    </div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center">
                      <Xinference.Color size={40} />
                    </div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center">
                      <Typography.Text className="!text-lg sm:!text-xl md:!text-2xl lg:!text-3xl font-bold">30+</Typography.Text>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="overflow-x-hidden w-full">
          {homePageContent.startsWith('https://') ? (
            <iframe
              src={homePageContent}
              className="w-full h-screen border-none"
            />
          ) : (
            <div
              className="text-base md:text-lg p-4 md:p-6 lg:p-8 overflow-x-hidden max-w-6xl mx-auto"
              dangerouslySetInnerHTML={{ __html: homePageContent }}
            ></div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;

