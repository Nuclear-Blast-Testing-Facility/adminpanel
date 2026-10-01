<template>
  <div class="min-h-screen flex flex-col justify-between">
    <!-- Top Nav Header -->
    <header class="border-b border-slate-800 bg-facility-900/90 backdrop-blur-md sticky top-0 z-40">
      <div class="container mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(255,183,3,0.2)]">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-display text-lg font-bold tracking-wider text-white">NBTF.CA</span>
              <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold">
                ADMIN PANEL
              </span>
            </div>
            <p class="text-[11px] text-slate-400 font-mono">Master Database & Configuration Console</p>
          </div>
        </div>

        <!-- System health, save action, user profile -->
        <div class="flex items-center gap-3 font-mono text-xs">
          <!-- Live Notification Badge -->
          <span
            v-if="statusMessage"
            :class="[
              'px-2.5 py-1 rounded border transition-all text-[11px]',
              statusType === 'success' ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50' : 'bg-red-950/80 text-red-300 border-red-500/50'
            ]"
          >
            {{ statusMessage }}
          </span>

          <div class="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-facility-850 border border-slate-800 text-slate-400">
            <span class="w-2 h-2 rounded-full" :class="redisHealthy ? 'bg-emerald-400' : 'bg-amber-400'"></span>
            <span>REDIS: {{ redisMode.toUpperCase() }}</span>
          </div>

          <button
            @click="handleSaveAll"
            :disabled="saving"
            class="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,183,3,0.25)] transition-all disabled:opacity-50"
          >
            <svg v-if="saving" class="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
              <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
            </svg>
            <span>{{ saving ? 'SAVING...' : 'COMMIT ALL' }}</span>
          </button>

          <button
            @click="handleLogout"
            class="p-1.5 rounded-lg bg-facility-800 hover:bg-facility-700 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors"
            title="Sign out"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>

      <!-- Module Tabs -->
      <div class="border-t border-slate-800 bg-facility-950/60 px-4">
        <div class="container mx-auto flex items-center gap-2 overflow-x-auto py-2 font-mono text-xs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'px-3.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1.5',
              activeTab === tab.id
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_10px_rgba(255,183,3,0.15)] font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-facility-850 border border-transparent'
            ]"
          >
            <span>{{ tab.label }}</span>
            <span v-if="tab.count !== undefined" class="px-1.5 py-0.2 rounded bg-slate-800 text-[10px] text-slate-300">
              {{ tab.count }}
            </span>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Tab Content Area -->
    <main class="container mx-auto px-4 py-8 flex-1 max-w-6xl">
      <!-- TAB 1: OVERVIEW & DASHBOARD -->
      <section v-if="activeTab === 'overview'" class="space-y-8">
        <!-- Quick Stats -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
          <div class="admin-card p-5 rounded-xl">
            <span class="text-slate-400">DIRECTORY ENDPOINTS</span>
            <p class="text-3xl font-display font-bold text-amber-400 mt-1">
              {{ totalIndexLinks }}
            </p>
            <span class="text-slate-500">Across {{ indexData?.categories?.length || 0 }} categories</span>
          </div>

          <div class="admin-card p-5 rounded-xl">
            <span class="text-slate-400">GAME DOSSIER ROLES</span>
            <p class="text-3xl font-display font-bold text-cyan-400 mt-1">
              {{ wwwData?.roles?.length || 0 }}
            </p>
            <span class="text-slate-500">28 classes configured</span>
          </div>

          <div class="admin-card p-5 rounded-xl">
            <span class="text-slate-400">FACILITY ALERT STATE</span>
            <p class="text-xl font-display font-bold mt-2" :class="alertStateColor">
              {{ wwwData?.bannerAlert?.level || 'NOMINAL' }}
            </p>
            <span class="text-slate-500">Banner: {{ wwwData?.bannerAlert?.enabled ? 'Active' : 'Muted' }}</span>
          </div>

          <div class="admin-card p-5 rounded-xl">
            <span class="text-slate-400">LAST PERSISTED</span>
            <p class="text-xs font-bold text-slate-200 mt-2 truncate">
              {{ lastUpdatedTime }}
            </p>
            <span class="text-slate-500">Synced to Redis cluster</span>
          </div>
        </div>

        <!-- Quick Actions & Diagnostics -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="admin-card p-6 rounded-2xl space-y-4">
            <h3 class="text-base font-display font-bold text-white uppercase tracking-wider">
              Quick Management Operations
            </h3>
            <p class="text-xs text-slate-400 leading-relaxed">
              Trigger synchronization across the connected Vercel deployments (<a href="https://index.nbtf.ca" target="_blank" class="text-amber-400 underline">index.nbtf.ca</a> and <a href="https://www.nbtf.ca" target="_blank" class="text-cyan-400 underline">www.nbtf.ca</a>).
            </p>

            <div class="flex flex-wrap gap-3 font-mono text-xs pt-2">
              <button
                @click="handleSaveAll"
                class="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
              >
                Sync Data to Redis
              </button>
              <button
                @click="handleResetDefaults"
                class="px-4 py-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40"
              >
                Reset to Master Defaults
              </button>
              <button
                @click="exportJsonBackup"
                class="px-4 py-2 rounded-lg bg-facility-800 hover:bg-facility-700 text-slate-200 border border-slate-700"
              >
                Export JSON Backup
              </button>
            </div>
          </div>

          <!-- Domain info -->
          <div class="admin-card p-6 rounded-2xl space-y-3 font-mono text-xs">
            <h3 class="text-base font-display font-bold text-white uppercase tracking-wider">
              Domain & Architecture Status
            </h3>
            <div class="space-y-2 text-slate-300">
              <div class="flex justify-between py-1 border-b border-slate-800">
                <span class="text-slate-500">Domain</span>
                <span class="text-white">nbtf.ca (Second-level domain)</span>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-800">
                <span class="text-slate-500">Maintainer / Sponsor</span>
                <span class="text-amber-300">cbx.nz &bull; cbx.kiwi</span>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-800">
                <span class="text-slate-500">DNS & CDN</span>
                <span class="text-white">Cloudflare Proxy</span>
              </div>
              <div class="flex justify-between py-1">
                <span class="text-slate-500">Target Repos</span>
                <span class="text-slate-400">github.com/Nuclear-Blast-Testing-Facility</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Audit Activity Log -->
        <div class="admin-card rounded-2xl p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base font-display font-bold text-white uppercase tracking-wider">
              Recent System Audit Trail
            </h3>
            <span class="text-xs font-mono text-slate-500">{{ auditLogs.length }} recorded entries</span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left font-mono text-xs">
              <thead>
                <tr class="border-b border-slate-800 text-slate-400 uppercase text-[11px]">
                  <th class="pb-2">Timestamp</th>
                  <th class="pb-2">Action</th>
                  <th class="pb-2">Target</th>
                  <th class="pb-2">User</th>
                  <th class="pb-2">Details</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800/60">
                <tr v-for="log in auditLogs.slice(0, 8)" :key="log.id" class="hover:bg-facility-850/50">
                  <td class="py-2.5 text-slate-500 whitespace-nowrap">{{ log.timestamp?.substring(0, 19).replace('T', ' ') }}</td>
                  <td class="py-2.5 font-bold text-amber-300 whitespace-nowrap">{{ log.action }}</td>
                  <td class="py-2.5 uppercase text-cyan-400 whitespace-nowrap">{{ log.target }}</td>
                  <td class="py-2.5 text-slate-300 whitespace-nowrap">{{ log.user }}</td>
                  <td class="py-2.5 text-slate-400 truncate max-w-xs">{{ log.details || '—' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- TAB 2: DIRECTORY & SUBDOMAINS (INDEX-NBTF-CA) -->
      <section v-if="activeTab === 'index'" class="space-y-8">
        <!-- Site Metadata & Announcement Banner -->
        <div class="admin-card p-6 rounded-2xl space-y-4">
          <h3 class="text-base font-display font-bold text-white uppercase tracking-wider">
            Index Directory Header & Announcement
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            <div>
              <label class="block text-slate-400 mb-1">Site Title</label>
              <input
                v-model="indexData.siteTitle"
                type="text"
                class="w-full px-3 py-2 bg-facility-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label class="block text-slate-400 mb-1">Site Tagline</label>
              <input
                v-model="indexData.siteTagline"
                type="text"
                class="w-full px-3 py-2 bg-facility-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <!-- Announcement Bulletin -->
          <div class="p-4 rounded-xl bg-facility-900 border border-slate-800 font-mono text-xs space-y-3">
            <div class="flex items-center justify-between">
              <span class="font-bold text-amber-300">Top Announcement Banner</span>
              <label class="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  v-model="indexData.bannerAnnouncement!.enabled"
                  type="checkbox"
                  class="rounded bg-slate-800 border-slate-700 text-amber-400 focus:ring-0"
                />
                <span>Active</span>
              </label>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div class="md:col-span-2">
                <label class="block text-slate-400 mb-1">Banner Text</label>
                <input
                  v-model="indexData.bannerAnnouncement!.text"
                  type="text"
                  class="w-full px-3 py-2 bg-facility-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label class="block text-slate-400 mb-1">Optional Link</label>
                <input
                  v-model="indexData.bannerAnnouncement!.link"
                  type="text"
                  class="w-full px-3 py-2 bg-facility-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          <!-- Disclaimers -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            <div>
              <label class="block text-slate-400 mb-1">Domain Disclaimer</label>
              <textarea
                v-model="indexData.disclaimer"
                rows="2"
                class="w-full px-3 py-2 bg-facility-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-400"
              ></textarea>
            </div>
            <div>
              <label class="block text-slate-400 mb-1">Maintainer Notice</label>
              <textarea
                v-model="indexData.maintainerNotice"
                rows="2"
                class="w-full px-3 py-2 bg-facility-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-400"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Category & Links Editor -->
        <div class="space-y-6">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-display font-bold text-white uppercase tracking-wider">
              Categories & Link Endpoints
            </h3>
            <button
              @click="addCategory"
              class="px-3.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold"
            >
              + Add Category
            </button>
          </div>

          <div
            v-for="(cat, catIdx) in indexData.categories"
            :key="cat.id || catIdx"
            class="admin-card p-6 rounded-2xl space-y-4"
          >
            <div class="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800 font-mono text-xs">
              <div class="flex items-center gap-2 flex-1 min-w-[200px]">
                <input
                  v-model="cat.name"
                  type="text"
                  placeholder="Category Name"
                  class="px-3 py-1.5 bg-facility-900 border border-slate-700 rounded-lg text-white font-bold text-sm focus:outline-none focus:border-amber-400 flex-1 max-w-xs"
                />
                <input
                  v-model="cat.description"
                  type="text"
                  placeholder="Category Description"
                  class="px-3 py-1.5 bg-facility-900 border border-slate-800 rounded-lg text-slate-400 text-xs focus:outline-none focus:border-amber-400 flex-1"
                />
              </div>

              <div class="flex items-center gap-2">
                <button
                  @click="addLinkToCategory(catIdx)"
                  class="px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold"
                >
                  + Add Link
                </button>
                <button
                  @click="deleteCategory(catIdx)"
                  class="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30"
                  title="Delete category"
                >
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Links in this category -->
            <div class="space-y-3">
              <div
                v-for="(link, linkIdx) in cat.links"
                :key="link.id || linkIdx"
                class="p-3.5 rounded-xl bg-facility-900 border border-slate-800 font-mono text-xs grid grid-cols-1 md:grid-cols-12 gap-3 items-center"
              >
                <div class="md:col-span-3">
                  <label class="block text-[10px] text-slate-500 mb-0.5">TITLE</label>
                  <input
                    v-model="link.title"
                    type="text"
                    placeholder="Link Title"
                    class="w-full px-2.5 py-1.5 bg-facility-950 border border-slate-800 rounded text-slate-200 text-xs"
                  />
                </div>

                <div class="md:col-span-3">
                  <label class="block text-[10px] text-slate-500 mb-0.5">URL / ENDPOINT</label>
                  <input
                    v-model="link.url"
                    type="text"
                    placeholder="https://..."
                    class="w-full px-2.5 py-1.5 bg-facility-950 border border-slate-800 rounded text-slate-200 text-xs"
                  />
                </div>

                <div class="md:col-span-2">
                  <label class="block text-[10px] text-slate-500 mb-0.5">DISPLAY URL</label>
                  <input
                    v-model="link.displayUrl"
                    type="text"
                    placeholder="web.nbtf.ca"
                    class="w-full px-2.5 py-1.5 bg-facility-950 border border-slate-800 rounded text-slate-200 text-xs"
                  />
                </div>

                <div class="md:col-span-2">
                  <label class="block text-[10px] text-slate-500 mb-0.5">BADGE</label>
                  <input
                    v-model="link.badge"
                    type="text"
                    placeholder="e.g. Main Web"
                    class="w-full px-2.5 py-1.5 bg-facility-950 border border-slate-800 rounded text-slate-200 text-xs"
                  />
                </div>

                <div class="md:col-span-2 flex items-center justify-between gap-2">
                  <div class="flex items-center gap-1.5">
                    <label class="flex items-center gap-1 text-[11px] text-slate-400">
                      <input v-model="link.isEmail" type="checkbox" class="rounded bg-slate-800" />
                      <span>Email</span>
                    </label>
                  </div>
                  <button
                    @click="deleteLink(catIdx, linkIdx)"
                    class="p-1.5 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30"
                    title="Remove link"
                  >
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>

                <!-- Description row -->
                <div class="md:col-span-12">
                  <input
                    v-model="link.description"
                    type="text"
                    placeholder="Description of the subdomain or mailbox"
                    class="w-full px-2.5 py-1 bg-facility-950 border border-slate-800/80 rounded text-slate-400 text-[11px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- TAB 3: GAME DOSSIER & 28 ROLES (WWW-NBTF-CA) -->
      <section v-if="activeTab === 'www'" class="space-y-8">
        <!-- Live Alert Banner Settings -->
        <div class="admin-card p-6 rounded-2xl space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-base font-display font-bold text-white uppercase tracking-wider">
              Live Facility Alert System
            </h3>
            <label class="flex items-center gap-2 cursor-pointer font-mono text-xs text-slate-300">
              <input
                v-model="wwwData.bannerAlert!.enabled"
                type="checkbox"
                class="rounded bg-slate-800 border-slate-700 text-rose-500"
              />
              <span>Banner Enabled</span>
            </label>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
            <div>
              <label class="block text-slate-400 mb-1">DEFCON / Alert Level</label>
              <select
                v-model="wwwData.bannerAlert!.level"
                class="w-full px-3 py-2 bg-facility-900 border border-slate-800 rounded-lg text-slate-100 font-bold"
              >
                <option value="NOMINAL">NOMINAL (Green/Cyan)</option>
                <option value="DEFCON 3">DEFCON 3 (Elevated)</option>
                <option value="DEFCON 2">DEFCON 2 (Amber / Breach)</option>
                <option value="LEVEL 5 EMERGENCY">LEVEL 5 EMERGENCY (Red Meltdown)</option>
              </select>
            </div>

            <div class="md:col-span-3">
              <label class="block text-slate-400 mb-1">Alert Broadcast Message</label>
              <input
                v-model="wwwData.bannerAlert!.message"
                type="text"
                class="w-full px-3 py-2 bg-facility-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        <!-- 28 Roles Editor -->
        <div class="space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 class="text-lg font-display font-bold text-white uppercase tracking-wider">
                Roles & Personnel Configuration ({{ wwwData.roles.length }} Roles)
              </h3>
              <p class="text-xs text-slate-400 font-mono">Edit loadouts, keycards, Robux pricing, and duties</p>
            </div>

            <button
              @click="addNewRole"
              class="px-3.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold"
            >
              + Add New Role
            </button>
          </div>

          <!-- Roles Table/Cards -->
          <div class="space-y-3">
            <div
              v-for="(role, rIdx) in wwwData.roles"
              :key="role.id || rIdx"
              class="admin-card p-4 rounded-xl space-y-3 font-mono text-xs"
            >
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3 items-center">
                <div>
                  <label class="block text-[10px] text-slate-500 mb-0.5">ROLE NAME</label>
                  <input
                    v-model="role.name"
                    type="text"
                    class="w-full px-2.5 py-1.5 bg-facility-950 border border-slate-800 rounded text-white font-bold"
                  />
                </div>

                <div>
                  <label class="block text-[10px] text-slate-500 mb-0.5">DEPARTMENT</label>
                  <select
                    v-model="role.category"
                    class="w-full px-2 py-1.5 bg-facility-950 border border-slate-800 rounded text-slate-200"
                  >
                    <option value="Executive">Executive</option>
                    <option value="Government">Government</option>
                    <option value="Scientist">Scientist</option>
                    <option value="Military">Military</option>
                    <option value="Security">Security</option>
                    <option value="Safety">Safety</option>
                    <option value="Logistics">Logistics</option>
                    <option value="Rebellion">Rebellion</option>
                    <option value="Neutral">Neutral</option>
                  </select>
                </div>

                <div>
                  <label class="block text-[10px] text-slate-500 mb-0.5">SIDE</label>
                  <select
                    v-model="role.side"
                    class="w-full px-2 py-1.5 bg-facility-950 border border-slate-800 rounded text-slate-200"
                  >
                    <option value="Facility">Facility</option>
                    <option value="Rebellion">Rebellion</option>
                    <option value="Neutral">Neutral</option>
                  </select>
                </div>

                <div>
                  <label class="block text-[10px] text-slate-500 mb-0.5">CLEARANCE</label>
                  <input
                    v-model="role.clearanceLevel"
                    type="text"
                    class="w-full px-2.5 py-1.5 bg-facility-950 border border-slate-800 rounded text-slate-200"
                  />
                </div>

                <div>
                  <label class="block text-[10px] text-slate-500 mb-0.5">PRICE (ROBUX)</label>
                  <input
                    v-model.number="role.costRobux"
                    type="number"
                    placeholder="0 (Free)"
                    class="w-full px-2.5 py-1.5 bg-facility-950 border border-slate-800 rounded text-slate-200"
                  />
                </div>

                <div class="flex items-center justify-end gap-2 pt-3">
                  <label class="flex items-center gap-1 text-[11px] text-amber-300">
                    <input v-model="role.hasLaunchKeycard" type="checkbox" class="rounded bg-slate-800" />
                    <span>Launch Card</span>
                  </label>
                  <button
                    @click="deleteRole(rIdx)"
                    class="p-1.5 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30"
                    title="Delete role"
                  >
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Purpose & Spawn -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label class="block text-[10px] text-slate-500 mb-0.5">PURPOSE</label>
                  <input
                    v-model="role.purpose"
                    type="text"
                    class="w-full px-2.5 py-1 bg-facility-950 border border-slate-800 rounded text-slate-300 text-[11px]"
                  />
                </div>
                <div>
                  <label class="block text-[10px] text-slate-500 mb-0.5">SPAWN LOCATION</label>
                  <input
                    v-model="role.spawnLocation"
                    type="text"
                    class="w-full px-2.5 py-1 bg-facility-950 border border-slate-800 rounded text-slate-300 text-[11px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Official Lore & Discord Configuration -->
        <div v-if="wwwData.officialLore" class="admin-card p-6 rounded-2xl space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 class="text-base font-display font-bold text-white uppercase tracking-wider">
              Official Lore & Developer Facts (Ryanblaze)
            </h3>
            <span class="text-xs font-mono text-indigo-400">Official Lore Canon</span>
          </div>

          <div class="space-y-4 font-mono text-xs">
            <div>
              <label class="block text-slate-400 mb-1">Developer Notice / Instructions</label>
              <textarea
                v-model="wwwData.officialLore.developerNotice"
                rows="3"
                class="w-full px-3 py-2 bg-facility-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-400"
              ></textarea>
            </div>

            <!-- Facts List -->
            <div class="space-y-3">
              <label class="block text-slate-400 font-bold">Official Lore Statements (5 Developer Canon Facts)</label>
              <div
                v-for="(fact, fIdx) in wwwData.officialLore.facts"
                :key="fact.id || fIdx"
                class="p-3 rounded-xl bg-facility-900 border border-slate-800 space-y-2"
              >
                <div class="flex items-center justify-between">
                  <input
                    v-model="fact.title"
                    type="text"
                    class="px-2.5 py-1 bg-facility-950 border border-slate-800 rounded text-indigo-300 font-bold text-xs"
                    placeholder="Fact Title"
                  />
                  <span class="text-[10px] text-slate-500">FACT #{{ fIdx + 1 }}</span>
                </div>
                <input
                  v-model="fact.statement"
                  type="text"
                  class="w-full px-2.5 py-1.5 bg-facility-950 border border-slate-800 rounded text-slate-200 text-xs"
                  placeholder="Official Fact Statement"
                />
              </div>
            </div>

            <!-- Factions Discord Note -->
            <div class="p-4 rounded-xl bg-facility-900 border border-indigo-500/30 space-y-3">
              <div class="flex items-center justify-between">
                <span class="font-bold text-indigo-300">Factions Discord Information</span>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label class="block text-slate-500 text-[10px] mb-1">DISCORD NOTICE</label>
                  <input
                    v-model="wwwData.officialLore.discordInfo.text"
                    type="text"
                    class="w-full px-2.5 py-1.5 bg-facility-950 border border-slate-800 rounded text-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label class="block text-slate-500 text-[10px] mb-1">DISCORD URL</label>
                  <input
                    v-model="wwwData.officialLore.discordInfo.url"
                    type="text"
                    class="w-full px-2.5 py-1.5 bg-facility-950 border border-slate-800 rounded text-slate-200 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- TAB 4: RAW REDIS JSON DATASTORE -->
      <section v-if="activeTab === 'redis'" class="space-y-6 font-mono text-xs">
        <div class="admin-card p-6 rounded-2xl space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-base font-display font-bold text-white uppercase tracking-wider">
                Raw Redis Datastore
              </h3>
              <p class="text-xs text-slate-400">Directly inspect and mutate raw JSON objects stored under Redis keys</p>
            </div>

            <div class="flex items-center gap-2">
              <button
                @click="loadRawJson"
                class="px-3 py-1.5 rounded-lg bg-facility-800 hover:bg-facility-700 text-slate-300 border border-slate-700"
              >
                Reload JSON
              </button>
              <button
                @click="applyRawJson"
                class="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
              >
                Apply & Save JSON
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-slate-400 font-bold mb-1">KEY: nbtf:index:data</label>
              <textarea
                v-model="rawIndexJson"
                rows="18"
                class="w-full p-3 bg-facility-950 border border-slate-800 rounded-xl text-cyan-300 font-mono text-[11px] focus:outline-none focus:border-amber-400"
              ></textarea>
            </div>

            <div>
              <label class="block text-slate-400 font-bold mb-1">KEY: nbtf:www:data</label>
              <textarea
                v-model="rawWwwJson"
                rows="18"
                class="w-full p-3 bg-facility-950 border border-slate-800 rounded-xl text-rose-300 font-mono text-[11px] focus:outline-none focus:border-amber-400"
              ></textarea>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="border-t border-slate-800 bg-facility-950 py-6">
      <div class="container mx-auto px-4 max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
        <div>
          &copy; {{ new Date().getFullYear() }} NBTF.CA Administrative Gateway.
        </div>
        <div class="flex items-center gap-4">
          <a href="https://index.nbtf.ca" target="_blank" class="hover:text-amber-400 transition-colors">Directory Portal</a>
          <span class="text-slate-700">&bull;</span>
          <a href="https://www.nbtf.ca" target="_blank" class="hover:text-amber-400 transition-colors">Game Reference</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { defaultDirectoryData, type DirectoryData } from '~/server/utils/defaultDirectory'
import { defaultWwwData, type WwwSiteData } from '~/server/utils/defaultGameData'

const activeTab = ref('overview')
const saving = ref(false)
const statusMessage = ref('')
const statusType = ref<'success' | 'error'>('success')
const redisMode = ref('memory')
const redisHealthy = ref(true)

const indexData = ref<DirectoryData>(JSON.parse(JSON.stringify(defaultDirectoryData)))
const wwwData = ref<WwwSiteData>(JSON.parse(JSON.stringify(defaultWwwData)))
const auditLogs = ref<any[]>([])

const rawIndexJson = ref('')
const rawWwwJson = ref('')

const tabs = computed(() => [
  { id: 'overview', label: 'Overview & Telemetry' },
  { id: 'index', label: 'Directory Links (i.nbtf.ca)', count: totalIndexLinks.value },
  { id: 'www', label: 'Game Dossier & Roles (www.nbtf.ca)', count: wwwData.value?.roles?.length },
  { id: 'redis', label: 'Redis Datastore JSON' }
])

const totalIndexLinks = computed(() => {
  if (!indexData.value?.categories) return 0
  return indexData.value.categories.reduce((acc, cat) => acc + (cat.links?.length || 0), 0)
})

const lastUpdatedTime = computed(() => {
  return indexData.value?.updatedAt ? new Date(indexData.value.updatedAt).toLocaleString() : 'Just now'
})

const alertStateColor = computed(() => {
  const lvl = wwwData.value?.bannerAlert?.level
  if (lvl === 'LEVEL 5 EMERGENCY') return 'text-red-400 animate-pulse'
  if (lvl?.includes('DEFCON')) return 'text-amber-400'
  return 'text-emerald-400'
})

// Fetch initial data
const loadInitialData = async () => {
  try {
    const [idxRes, wwwRes, logsRes, healthRes] = await Promise.all([
      $fetch<{ success: boolean; data: DirectoryData }>('/api/index-data'),
      $fetch<{ success: boolean; data: WwwSiteData }>('/api/www-data'),
      $fetch<{ success: boolean; logs: any[] }>('/api/audit-logs'),
      $fetch<{ redisMode: string }>('/api/health')
    ])

    if (idxRes.data) indexData.value = idxRes.data
    if (wwwRes.data) wwwData.value = wwwRes.data
    if (logsRes.logs) auditLogs.value = logsRes.logs
    if (healthRes.redisMode) redisMode.value = healthRes.redisMode

    loadRawJson()
  } catch (err) {
    console.error('Failed to load initial data:', err)
  }
}

onMounted(() => {
  loadInitialData()
})

const loadRawJson = () => {
  rawIndexJson.value = JSON.stringify(indexData.value, null, 2)
  rawWwwJson.value = JSON.stringify(wwwData.value, null, 2)
}

const applyRawJson = () => {
  try {
    indexData.value = JSON.parse(rawIndexJson.value)
    wwwData.value = JSON.parse(rawWwwJson.value)
    handleSaveAll()
  } catch (err: any) {
    statusMessage.value = 'JSON syntax error: ' + err.message
    statusType.value = 'error'
  }
}

// Save all modifications
const handleSaveAll = async () => {
  saving.value = true
  statusMessage.value = ''

  try {
    const [idxOk, wwwOk] = await Promise.all([
      $fetch('/api/index-data', { method: 'POST', body: indexData.value }),
      $fetch('/api/www-data', { method: 'POST', body: wwwData.value })
    ])

    statusMessage.value = 'All configurations synced successfully!'
    statusType.value = 'success'
    
    // Refresh audit logs
    const logsRes = await $fetch<{ success: boolean; logs: any[] }>('/api/audit-logs')
    if (logsRes.logs) auditLogs.value = logsRes.logs

    setTimeout(() => {
      statusMessage.value = ''
    }, 4000)
  } catch (err: any) {
    statusMessage.value = 'Failed to save changes: ' + (err?.data?.statusMessage || err.message)
    statusType.value = 'error'
  } finally {
    saving.value = false
  }
}

// Category & Link operations
const addCategory = () => {
  indexData.value.categories.push({
    id: 'cat-' + Date.now(),
    name: 'New Category',
    description: '',
    links: []
  })
}

const deleteCategory = (idx: number) => {
  if (confirm('Delete this category and all its links?')) {
    indexData.value.categories.splice(idx, 1)
  }
}

const addLinkToCategory = (catIdx: number) => {
  indexData.value.categories[catIdx].links.push({
    id: 'link-' + Date.now(),
    title: 'New Link',
    url: 'https://',
    displayUrl: '',
    description: '',
    status: 'online'
  })
}

const deleteLink = (catIdx: number, linkIdx: number) => {
  indexData.value.categories[catIdx].links.splice(linkIdx, 1)
}

// Role operations
const addNewRole = () => {
  wwwData.value.roles.push({
    id: 'role-' + Date.now(),
    name: 'New Role',
    category: 'Military',
    side: 'Facility',
    clearanceLevel: 'Level 3',
    hasLaunchKeycard: false,
    isPaid: false,
    costRobux: 0,
    spawnLocation: 'Facility Sector',
    purpose: 'Standard operations role',
    responsibilities: ['Defend sector', 'Report incidents'],
    equipment: ['Sidearm', 'Level 3 Keycard']
  })
}

const deleteRole = (idx: number) => {
  if (confirm('Delete this role?')) {
    wwwData.value.roles.splice(idx, 1)
  }
}

// Reset defaults
const handleResetDefaults = async () => {
  if (confirm('Are you sure you want to reset all data across index and www to master reference defaults?')) {
    try {
      await $fetch('/api/reset-defaults', { method: 'POST' })
      await loadInitialData()
      statusMessage.value = 'Reset to master defaults completed!'
      statusType.value = 'success'
    } catch (err) {
      statusMessage.value = 'Reset failed'
      statusType.value = 'error'
    }
  }
}

// Export backup
const exportJsonBackup = () => {
  const backup = {
    exportDate: new Date().toISOString(),
    indexData: indexData.value,
    wwwData: wwwData.value
  }
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `nbtf-ca-backup-${new Date().toISOString().substring(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

// Logout
const handleLogout = async () => {
  await $fetch('/api/auth/logout', { method: 'POST' })
  await navigateTo('/login')
}
</script>
