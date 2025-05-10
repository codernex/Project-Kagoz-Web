<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"
  exclude-result-prefixes="s">

  <xsl:output method="html" indent="yes"/>

  <xsl:template match="/">
    <html>
      <head>
        <title>Business Sitemap</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            background-color: #f9f9f9;
          }
          h2 {
            color: #2c3e50;
          }
          .url {
            padding: 10px;
            background: #fff;
            border-bottom: 1px solid #ddd;
            margin-bottom: 5px;
          }
          .url a {
            color: #3498db;
            text-decoration: none;
            font-weight: bold;
          }
          .meta {
            font-size: 12px;
            color: #888;
          }
              .pagination {
            margin-top: 40px;
            padding: 10px;
            background: #f1f1f1;
            border-radius: 8px;
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
          }
          .pagination a {
            background: #3498db;
            color: white;
            text-decoration: none;
            padding: 8px 14px;
            border-radius: 5px;
            font-size: 14px;
          }
          .pagination a:hover {
            background-color: #2980b9;
          }
        </style>
      </head>
      <body>
        <h2>Business Sitemap</h2>
        <xsl:for-each select="s:urlset/s:url">
          <div class="url">
            <a href="{s:loc}">
              <xsl:value-of select="s:loc"/>
            </a>
            <div class="meta">
              Last Updated: <xsl:value-of select="s:lastmod"/>
            </div>
          </div>
        </xsl:for-each>


        <h2>Pagination</h2>
        <div class="pagination">
             <xsl:for-each select="s:urlset/*[local-name()='pageLinks']/*[local-name()='link']">
    <a href="{@url}">Page <xsl:value-of select="@page"/></a>
  </xsl:for-each>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>