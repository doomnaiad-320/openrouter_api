import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

const SEO = ({ 
  title, 
  description, 
  keywords, 
  image, 
  url,
  type = 'website',
  noindex = false 
}) => {
  const { t } = useTranslation();
  
  // 默认SEO配置
  const defaultTitle = t('New API - 专业的AI API统一网关');
  const defaultDescription = t('New API提供稳定、低价的AI API接口服务，支持OpenAI、Claude、Gemini等多种模型，专为开发者和企业打造的统一API网关。');
  const defaultKeywords = 'AI API,OpenAI API,Claude API,Gemini API,AI网关,人工智能接口,API管理,开发者工具';
  const defaultImage = '/logo.png';
  const siteUrl = window.location.origin;
  
  const seoTitle = title ? `${title} - New API` : defaultTitle;
  const seoDescription = description || defaultDescription;
  const seoKeywords = keywords || defaultKeywords;
  const seoImage = image ? `${siteUrl}${image}` : `${siteUrl}${defaultImage}`;
  const seoUrl = url ? `${siteUrl}${url}` : window.location.href;

  return (
    <Helmet>
      {/* 基础元数据 */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />
      
      {/* 搜索引擎指令 */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      {!noindex && <meta name="robots" content="index, follow" />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:site_name" content="New API" />
      <meta property="og:locale" content="zh_CN" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />
      
      {/* 移动端优化 */}
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <meta name="theme-color" content="#1f2937" />
      
      {/* 结构化数据 */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "New API",
          "description": seoDescription,
          "url": siteUrl,
          "applicationCategory": "DeveloperApplication",
          "operatingSystem": "Web",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "CNY"
          },
          "provider": {
            "@type": "Organization",
            "name": "New API Team"
          }
        })}
      </script>
    </Helmet>
  );
};

export default SEO;
