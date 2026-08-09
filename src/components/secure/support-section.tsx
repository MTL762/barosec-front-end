"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { MessageSquare, Headset, Mail, Phone, Clock, Send, CheckCircle2, HelpCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SupportSection() {
  const t = useTranslations("Support");
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: "agent", text: "مرحباً بك في مركز دعم باروسك! كيف يمكننا مساعدتك اليوم؟ 🛡️" }
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsgs = [...chatMessages, { sender: "user", text: inputMessage }];
    setChatMessages(newMsgs);
    setInputMessage("");

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { sender: "agent", text: "شكراً لرسالتك! يقوم أحد مهندسي الدعم الفني بمراجعة استفسارك الآن وسيتم الرد عليك في غضون لحظات." }
      ]);
    }, 1000);
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTicketSubmitted(true);
  };

  return (
    <section id="support" className="py-20 bg-muted/40 border-b border-border/80">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-3">
            <Headset className="size-3.5" />
            <span>الدعم الفني المباشر</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
            {t("title")}
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details & Info */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-background border border-border rounded-2xl p-6 space-y-6 shadow-sm">
              <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Phone className="size-5 text-primary" />
                <span>{t("contactInfo")}</span>
              </h3>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Phone className="size-4" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">الرقم المجاني المباشر</div>
                    <div className="font-bold text-foreground">800-BAROSIC (800-2276742)</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Mail className="size-4" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">البريد الإلكتروني للدعم</div>
                    <div className="font-bold text-foreground">support@barosic.com</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Clock className="size-4" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">ساعات العمل والخدمة</div>
                    <div className="font-bold text-foreground">24/7 طوال أيام الأسبوع</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Live Chat Box Trigger */}
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                  <MessageSquare className="size-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-base">{t("chatTitle")}</h4>
                  <p className="text-xs text-blue-100">{t("chatSubtitle")}</p>
                </div>
              </div>
              <p className="text-xs text-blue-100 leading-relaxed">
                هل لديك استفسار سريع أو تحتاج لمساعدة في ربط الكاميرات؟ مهندسو باروسك متواجدون الآن عبر الدردشة الفورية.
              </p>
              <button
                onClick={() => setChatOpen(!chatOpen)}
                className="w-full py-2.5 px-4 rounded-xl bg-white text-blue-700 font-bold text-sm hover:bg-blue-50 transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <MessageSquare className="size-4" />
                <span>{chatOpen ? "إغلاق المحادثة المباشرة" : "بدء المحادثة المباشرة الآن"}</span>
              </button>
            </div>
          </div>

          {/* Interactive Live Chat or Ticket Form */}
          <div className="lg:col-span-8">
            {chatOpen ? (
              <div className="bg-background border border-border rounded-2xl shadow-lg flex flex-col h-[500px] overflow-hidden">
                <div className="bg-primary p-4 text-primary-foreground flex justify-between items-center">
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <div className="size-3 bg-emerald-400 rounded-full animate-ping absolute top-0 right-0" />
                      <div className="size-3 bg-emerald-400 rounded-full" />
                    </div>
                    <div>
                      <div className="font-bold text-sm">محادثة باروسك المباشرة 🛡️</div>
                      <div className="text-xs opacity-90">مهندس دعم فني نشط باللغة العربية</div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-muted/20">
                  {chatMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={cn(
                        "max-w-[80%] rounded-2xl p-3.5 text-sm leading-relaxed",
                        msg.sender === "user"
                          ? "bg-primary text-primary-foreground me-auto rounded-bl-none"
                          : "bg-background border border-border text-foreground ms-auto rounded-br-none shadow-sm"
                      )}
                    >
                      {msg.text}
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="p-3 border-t border-border bg-background flex gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="اكتب رسالتك لمهندس الدعم..."
                    className="flex-1 px-4 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="submit"
                    className={cn(buttonVariants({ size: "sm" }), "rounded-xl px-4 gap-1.5")}
                  >
                    <Send className="size-4 rtl:rotate-180" />
                    <span>إرسال</span>
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-background border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Mail className="size-5 text-primary" />
                  <span>{t("sendMessage")}</span>
                </h3>

                {ticketSubmitted ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 text-center space-y-3">
                    <div className="inline-flex size-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="size-6" />
                    </div>
                    <h4 className="text-lg font-bold text-foreground">تم إرسال تذكرة الدعم بنجاح!</h4>
                    <p className="text-xs text-muted-foreground max-w-md mx-auto">
                      رقم التذكرة الخاص بك هو <span className="font-mono font-bold text-primary">#BRS-94821</span>. تم إرسال تفاصيل التذكرة إلى بريدك الإلكتروني وسيتم التواصل معك خلال 15 دقيقة.
                    </p>
                    <button
                      onClick={() => setTicketSubmitted(false)}
                      className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-xl mt-2")}
                    >
                      إرسال تذكرة أخرى
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleTicketSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-foreground">الاسم الكامل</label>
                        <input
                          type="text"
                          required
                          placeholder="محمود أحمد"
                          className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-foreground">البريد الإلكتروني</label>
                        <input
                          type="email"
                          required
                          placeholder="name@example.com"
                          className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">رقم الهاتف / الحساب</label>
                      <input
                        type="tel"
                        placeholder="+966 50 000 0000"
                        className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">نوع الاستفسار أو المشكلة</label>
                      <select className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                        <option>استفسار عن الكاميرات والأنواع</option>
                        <option>مساعدة في ربط شبكة Wi-Fi</option>
                        <option>دعم الاشتراكات والفواتير</option>
                        <option>استفسار حول قسم الطوارئ</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">تفاصيل الرسالة</label>
                      <textarea
                        rows={4}
                        required
                        placeholder="اكتب تفاصيل مشكلتك أو استفسارك هنا..."
                        className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <button
                      type="submit"
                      className={cn(buttonVariants({ size: "lg" }), "w-full rounded-xl gap-2 font-bold shadow-lg shadow-primary/20")}
                    >
                      <Send className="size-4 rtl:rotate-180" />
                      <span>{t("sendMessage")}</span>
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
